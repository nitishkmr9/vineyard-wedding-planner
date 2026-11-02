// Server-only module: Lovable AI Gateway helpers + the planning assistant handler.
// Never import this from client code — it reads process.env.LOVABLE_API_KEY.

import type { UIMessage } from "ai";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let runIdResolved = false;
  const runIdReady = new Promise<string | undefined>((resolve) => {
    resolveRunId = resolve;
  });

  const publishRunId = (value?: string) => {
    const nextRunId = value?.trim() || undefined;
    if (!runId && nextRunId) {
      runId = nextRunId;
    }
    if (!runIdResolved) {
      runIdResolved = true;
      resolveRunId(runId);
    }
  };
  if (runId) publishRunId(runId);

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }

      try {
        const response = await fetch(input, { ...init, headers });
        publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) {
        publishRunId(undefined);
        throw error;
      }
    },
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : runIdReady),
  };
}

function getLovableAiGatewayRunId(request: Request) {
  return request.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
}

function getLovableAiGatewayResponseHeaders(
  providerHeaders: HeadersInit | undefined,
  init?: HeadersInit,
) {
  const headers = new Headers(init);
  const exposedHeaders = new Set(
    (headers.get("Access-Control-Expose-Headers") ?? "")
      .split(",")
      .map((header) => header.trim())
      .filter(Boolean),
  );

  new Headers(providerHeaders).forEach((value, name) => {
    if (name.toLowerCase().startsWith("x-lovable-aig-")) {
      headers.set(name, value);
      exposedHeaders.add(name);
    }
  });

  headers.forEach((_, name) => {
    if (name.toLowerCase().startsWith("x-lovable-aig-")) {
      exposedHeaders.add(name);
    }
  });

  if (exposedHeaders.size > 0) {
    headers.set("Access-Control-Expose-Headers", Array.from(exposedHeaders).join(", "));
  }

  return headers;
}

async function withLovableAiGatewayRunIdHeader(
  response: Response,
  gateway: {
    getRunId: () => string | undefined;
    waitForRunId: () => Promise<string | undefined>;
  },
) {
  if (!response.body) {
    const runId = gateway.getRunId();
    const headers = getLovableAiGatewayResponseHeaders(undefined, response.headers);
    if (runId) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: getLovableAiGatewayResponseHeaders(undefined, headers),
    });
  }

  const reader = response.body.getReader();
  const firstChunk = reader.read();
  const runId = await gateway.waitForRunId();
  const headers = getLovableAiGatewayResponseHeaders(undefined, response.headers);
  if (runId) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);

  const body = new ReadableStream({
    async start(controller) {
      try {
        const first = await firstChunk;
        if (first.done) {
          controller.close();
          return;
        }
        controller.enqueue(first.value);
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          controller.enqueue(chunk.value);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason?: unknown) {
      return reader.cancel(reason);
    },
  });

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: getLovableAiGatewayResponseHeaders(undefined, headers),
  });
}

const ASSISTANT_MODEL = "openai/gpt-6-astra";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";

const SYSTEM_PROMPT = `You are the Vine & Vow Assistant, a warm, deeply practical event-planning copilot for weddings, birthdays, and community events. You help with budgets, timelines, vendor checklists, and personalized ideas.

Context you already know: the couple is planning a rustic outdoor vineyard wedding for 120 guests with a $25,000 budget in June 2027. Their working allocation is: Venue & Catering $12,500; Photography & Film $2,500; Attire & Beauty $2,000; Flowers & Décor $2,000; Rentals & Lighting $1,500; Music $1,500; Stationery $750; Cake & Desserts $750; Officiant & Rings $750; Contingency $750. When they ask about "the plan" or "my budget", answer from these facts.

For every event you help plan:
- Budgets: realistic line-item allocations with per-guest costs, stated assumptions, and trade-offs ("shift X to afford Y").
- Timelines: ordered, dated checklists working backward from the event date, with booking windows and deadlines.
- Vendor checklists: what to book and in what order, questions to ask on site visits, contract red flags, and fallbacks.
- Personalized ideas: themes, palettes, menus, favors, entertainment, and touches tailored to the occasion, venue, and audience.

Style: warm and encouraging but concise and concrete. Use markdown with short bold headers and tight bullet lists. Always give real numbers with assumptions. When something is unclear (city, headcount, vibe), make a reasonable assumption, state it in one line, and continue. End longer plans with a short offer to adjust or go deeper.`;

export async function handleChatRequest(request: Request): Promise<Response> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The AI assistant is not configured. Please try again later." },
      { status: 500 },
    );
  }

  let body: { messages?: unknown };
  try {
    body = (await request.json()) as { messages?: unknown };
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const uiMessages = body.messages;
  if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const { createOpenAI } = await import("@ai-sdk/openai");
  const { streamText, convertToModelMessages } = await import("ai");

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const messages = uiMessages as UIMessage[];
  const result = streamText({
    model: provider.responses(ASSISTANT_MODEL),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({ originalMessages: messages, sendReasoning: true }),
    runIdFetch,
  );
}

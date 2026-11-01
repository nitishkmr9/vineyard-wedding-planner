import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Chat,
  DefaultChatTransport,
  type ChatStatus,
  type UIMessage,
} from "ai";
import {
  ArrowLeft,
  Cake,
  CalendarCheck,
  ClipboardList,
  PartyPopper,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";

import assistantMark from "@/assets/assistant-mark.png";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Vine & Vow Assistant — AI Event Planner" },
      {
        name: "description",
        content:
          "An AI planning assistant for weddings, birthdays, and community events — budgets, timelines, vendor checklists, and personalized ideas.",
      },
      { property: "og:title", content: "Vine & Vow Assistant — AI Event Planner" },
      {
        property: "og:description",
        content:
          "Plan weddings, birthdays, and community events with AI-built budgets, timelines, vendor checklists, and ideas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

const STORAGE_KEY = "vineyard-vows-assistant-v1";
const CONVERSATION_ID = "vine-vow-assistant";

const SUGGESTIONS = [
  {
    icon: Wallet,
    title: "Rework the wedding budget",
    prompt:
      "Help me trim $1,000 from my $25,000 vineyard wedding budget without losing the rustic magic. Show the trade-offs.",
  },
  {
    icon: ClipboardList,
    title: "Vendor checklist",
    prompt:
      "Build me a vendor checklist for my June 2027 vineyard wedding — what to book next, in what order, and questions to ask each one.",
  },
  {
    icon: Cake,
    title: "Birthday dinner",
    prompt:
      "Plan a 40th birthday dinner for 25 friends on a $2,000 budget, with a menu idea and a shopping timeline.",
  },
  {
    icon: PartyPopper,
    title: "Birthday party ideas",
    prompt:
      "Give me ideas for a wine-country birthday party — theme, activities, and personal touches guests will remember.",
  },
  {
    icon: Users,
    title: "Community fundraiser",
    prompt:
      "Help me organize a neighborhood summer fundraiser for 200 people. I need a budget outline and a volunteer checklist.",
  },
  {
    icon: CalendarCheck,
    title: "Gala timeline",
    prompt:
      "Draft a timeline for a charity gala happening in three months, working backward from the event date.",
  },
];

function AssistantPage() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );
  const [chat, setChat] = useState<Chat<UIMessage> | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Load the saved conversation after mount: localStorage is browser-only, and
  // reading it during render would hydration-mismatch.
  useEffect(() => {
    let saved: UIMessage[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) as UIMessage[];
    } catch {
      // corrupt storage — start fresh
    }
    setChat(
      new Chat<UIMessage>({
        id: CONVERSATION_ID,
        transport,
        messages: saved,
        onError: (event) => {
          const message =
            event instanceof Error
              ? event.message
              : typeof (event as { message?: unknown })?.message === "string"
                ? (event as { message: string }).message
                : "The assistant hit an unexpected error.";
          setStreamError(message);
        },
      }),
    );
  }, [transport]);

  const clearConversation = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage unavailable
    }
    setStreamError(null);
    setChat(
      new Chat<UIMessage>({ id: CONVERSATION_ID, transport, onError: () => {} }),
    );
  };

  if (!chat) {
    return (
      <div className="flex min-h-screen flex-col bg-background texture-grain">
        <AssistantHeader onClear={null} />
        <div className="flex flex-1 items-center justify-center">
          <Shimmer className="text-muted-foreground">Opening your planning session…</Shimmer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background texture-grain">
      <AssistantHeader onClear={clearConversation} />
      <AssistantChatView chat={chat} streamError={streamError} />
    </div>
  );
}

function AssistantHeader({ onClear }: { onClear: (() => void) | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Wedding plan</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <img
            src={assistantMark}
            alt="Vine & Vow Assistant mark"
            width={32}
            height={32}
            className="size-8"
          />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-foreground">
              Vine &amp; Vow Assistant
            </p>
            <p className="text-[11px] tracking-[0.18em] text-olive uppercase">
              AI event planner
            </p>
          </div>
        </div>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear conversation"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="size-4" />
          </button>
        ) : (
          <span className="size-8" />
        )}
      </div>
    </header>
  );
}

function AssistantChatView({
  chat,
  streamError,
}: {
  chat: Chat<UIMessage>;
  streamError: string | null;
}) {
  const { messages, status, sendMessage, stop } = useChat({ chat });

  // Persist the conversation whenever the stream has settled. Failures are
  // logged — losing a saved plan silently would be worse.
  useEffect(() => {
    if (status === "submitted" || status === "streaming") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn("Could not save the conversation", error);
    }
  }, [messages, status]);

  return (
    <>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
        <Conversation className="flex-1">
          <ConversationContent className="py-8">
            {messages.length === 0 ? (
              <EmptyState onPick={(prompt) => sendMessage({ text: prompt })} />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role} className="mb-8">
                  <MessageContent
                    className={
                      message.role === "user"
                        ? "rounded-2xl bg-secondary px-5 py-3.5 text-[15px]"
                        : "text-[15px]"
                    }
                  >
                    {message.parts.map((part, i) => {
                      if (part.type === "text" && part.text.trim().length > 0) {
                        return <MessageResponse key={i}>{part.text}</MessageResponse>;
                      }
                      if (part.type === "reasoning") {
                        return (
                          <Reasoning
                            key={i}
                            isStreaming={part.state === "streaming"}
                            className="mb-2"
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
            {status === "submitted" && (
              <div className="mb-8">
                <Shimmer className="text-muted-foreground">Planning…</Shimmer>
              </div>
            )}
            {streamError && (
              <div className="mb-8 rounded-2xl border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
                {streamError}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </main>
      <Composer status={status} onSend={(text) => sendMessage({ text })} onStop={stop} />
    </>
  );
}

function Composer({
  status,
  onSend,
  onStop,
}: {
  status: ChatStatus;
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const busy = status === "submitted" || status === "streaming";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep the composer focused: on first render, after sending, and once the
  // stream settles.
  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  return (
    <div className="sticky bottom-0 z-10 border-t border-border bg-background/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto max-w-3xl">
        <PromptInput
          onSubmit={({ text }) => {
            if (text.trim().length > 0) onSend(text);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            autoFocus
            placeholder="Ask about a wedding, birthday, or community event…"
            className="font-sans text-[15px]"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={onStop} disabled={!busy && false} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-[11px] tracking-wide text-muted-foreground">
          Ideas and numbers are a starting point — confirm prices with your vendors.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <img
        src={assistantMark}
        alt=""
        width={96}
        height={96}
        loading="lazy"
        className="size-24"
      />
      <h1 className="mt-6 font-display text-4xl font-semibold text-foreground">
        Let's plan something <em className="font-medium">unforgettable</em>
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Weddings, birthdays, community events — I'll build the budget, the
        timeline, the vendor checklist, and ideas that fit your crowd.
      </p>
      <div className="mt-10 grid w-full gap-3 text-left sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => onPick(s.prompt)}
            className={cn(
              "group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all",
              "hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md",
            )}
          >
            <s.icon className="size-5 text-primary" />
            <p className="mt-3 font-display text-lg font-semibold text-foreground">
              {s.title}
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {s.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

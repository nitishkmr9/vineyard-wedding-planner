import { createFileRoute } from "@tanstack/react-router";

import { handleChatRequest } from "@/lib/ai-gateway.server";

// Streaming chat endpoint for the planning assistant. Same-origin; the gateway
// key is read inside the server handler.
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: ({ request }) => handleChatRequest(request),
    },
  },
});

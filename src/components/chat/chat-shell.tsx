"use client";

import type { Attachment, ChatMessage, ChatStatus, CodeArtifact } from "@/lib/types";
import { generateUUID } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { ArtifactSidebar } from "./artifact-panel";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";

const DIJKSTRA_CODE = `function dijkstra(
  graph: Record<string, Record<string, number>>,
  start: string
): Record<string, number> {
  const distances: Record<string, number> = {};
  const visited = new Set<string>();

  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  while (true) {
    const current = Object.keys(distances)
      .filter((n) => !visited.has(n))
      .reduce((a, b) => (distances[a] < distances[b] ? a : b), "");

    if (!current || distances[current] === Infinity) break;
    visited.add(current);

    for (const [neighbor, weight] of Object.entries(graph[current] ?? {})) {
      const dist = distances[current] + weight;
      if (dist < distances[neighbor]) {
        distances[neighbor] = dist;
      }
    }
  }

  return distances;
}`;

const WEATHER_DATA = {
  city: "San Francisco, CA",
  temperature: 68,
  feelsLike: 65,
  condition: "Partly Cloudy",
  humidity: 72,
  wind: 18,
  high: 72,
  low: 58,
};

type SimulatedResponse =
  | { kind: "text"; text: string }
  | { kind: "weather"; intro: string }
  | { kind: "code"; intro: string; artifact: Omit<CodeArtifact, "id"> }
  | { kind: "thinking"; thought: string; then: string };

function getSimulatedResponse(text: string): SimulatedResponse {
  const lower = text.toLowerCase().trim();

  if (lower === "hello" || lower === "hello!") {
    return { kind: "text", text: "Hello! How can I help you today? I'm here to assist with any questions you might have." };
  }
  if (lower === "hi" || lower === "hi!") {
    return { kind: "text", text: "Hi there! What can I help you with?" };
  }
  if (lower.includes("weather")) {
    return {
      kind: "weather",
      intro: "Let me fetch the current weather conditions for you.",
    };
  }
  if (lower.includes("think") || lower.includes("reason") || lower.includes("explain")) {
    return {
      kind: "thinking",
      thought: "Breaking the problem into steps: first identify key concepts, then reason through each one carefully...",
      then: "After thinking through this carefully, I can see that the best approach is to break complex problems into smaller, manageable pieces. Each piece can be solved independently, and then the solutions combined to address the whole.",
    };
  }
  if (lower.includes("algorithm") || lower.includes("code") || lower.includes("dijkstra") || lower.includes("function") || lower.includes("typescript")) {
    return {
      kind: "code",
      intro: "Here's a TypeScript implementation of Dijkstra's shortest path algorithm:",
      artifact: {
        title: "dijkstra.ts",
        language: "typescript",
        content: DIJKSTRA_CODE,
      },
    };
  }
  if (lower.includes("next.js") || lower.includes("nextjs")) {
    return {
      kind: "text",
      text: "Next.js offers many advantages: server-side rendering, static site generation, API routes, file-based routing, automatic code splitting, built-in image optimization, and excellent TypeScript support. It's a production-ready React framework that handles many common web development concerns out of the box.",
    };
  }
  if (lower.includes("essay") || lower.includes("silicon valley")) {
    return {
      kind: "text",
      text: "Silicon Valley, located in the southern San Francisco Bay Area, is the global epicenter of technology innovation. Home to companies like Apple, Google, Meta, and countless startups, it represents a unique ecosystem where venture capital, world-class universities like Stanford, and entrepreneurial culture converge.",
    };
  }
  return {
    kind: "text",
    text: "That's an interesting question! I'm a simulated assistant in this UI demo. In a real integration, I would connect to an AI model and provide a helpful, detailed response. Feel free to try asking about: weather, code, algorithms, or thinking.",
  };
}

// ─── Streaming helpers ────────────────────────────────────────────────────────

function streamText(
  text: string,
  assistantId: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  onDone: () => void,
  intervalMs = 30
) {
  let charIndex = 0;
  const interval = setInterval(() => {
    charIndex += Math.floor(Math.random() * 4) + 2;
    const chunk = text.slice(0, charIndex);

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== assistantId) return msg;
        return {
          ...msg,
          parts: msg.parts.map((p) =>
            p.type === "text" ? { ...p, text: chunk } : p
          ),
        };
      })
    );

    if (charIndex >= text.length) {
      clearInterval(interval);
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== assistantId) return msg;
          return {
            ...msg,
            parts: msg.parts.map((p) =>
              p.type === "text" ? { ...p, text } : p
            ),
          };
        })
      );
      onDone();
    }
  }, intervalMs);
  return interval;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatShell() {
  const [chatId] = useState(() => generateUUID());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [openArtifact, setOpenArtifact] = useState<CodeArtifact | null>(null);
  const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      clearTimeout(streamRef.current);
      streamRef.current = null;
    }
    setStatus("ready");
    setMessages((prev) => {
      const last = prev.at(-1);
      if (last?.role === "assistant") {
        const textPart = last.parts.find((p) => p.type === "text");
        if (textPart && (textPart as { type: "text"; text: string }).text === "") {
          return prev.slice(0, -1);
        }
      }
      return prev;
    });
  }, []);

  const sendMessage = useCallback(
    (message: { role: "user"; parts: ChatMessage["parts"] }) => {
      const userMsg: ChatMessage = {
        id: generateUUID(),
        role: "user",
        parts: message.parts,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setStatus("submitted");

      const userText = message.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join(" ");

      const response = getSimulatedResponse(userText);
      const assistantId = generateUUID();

      // Initial delay before assistant responds
      streamRef.current = setTimeout(() => {
        if (response.kind === "weather") {
          // Step 1: add loading tool part
          const weatherToolCallId = generateUUID();
          const assistantMsg: ChatMessage = {
            id: assistantId,
            role: "assistant",
            parts: [
              { type: "text", text: "" },
              { type: "tool-weather", toolCallId: weatherToolCallId, state: "loading" },
            ],
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStatus("streaming");

          // Step 2: after 1.2s show result + stream intro text
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantId) return msg;
                return {
                  ...msg,
                  parts: [
                    { type: "text", text: "" },
                    {
                      type: "tool-weather" as const,
                      toolCallId: weatherToolCallId,
                      state: "result" as const,
                      output: WEATHER_DATA,
                    },
                  ],
                };
              })
            );
            streamText(
              response.intro,
              assistantId,
              setMessages,
              () => setStatus("ready")
            );
          }, 1200);

        } else if (response.kind === "code") {
          const codeToolCallId = generateUUID();
          const artifactId = generateUUID();
          const assistantMsg: ChatMessage = {
            id: assistantId,
            role: "assistant",
            parts: [
              { type: "text", text: "" },
              { type: "tool-code", toolCallId: codeToolCallId, state: "loading" },
            ],
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStatus("streaming");

          // After 1.4s resolve the code artifact
          setTimeout(() => {
            const artifact: CodeArtifact = { id: artifactId, ...response.artifact };
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantId) return msg;
                return {
                  ...msg,
                  parts: [
                    { type: "text", text: "" },
                    {
                      type: "tool-code" as const,
                      toolCallId: codeToolCallId,
                      state: "result" as const,
                      output: artifact,
                    },
                  ],
                };
              })
            );
            streamText(
              response.intro,
              assistantId,
              setMessages,
              () => setStatus("ready")
            );
          }, 1400);

        } else if (response.kind === "thinking") {
          // Show reasoning block (streaming=true), resolve after 2s, then stream text
          const assistantMsg: ChatMessage = {
            id: assistantId,
            role: "assistant",
            parts: [
              { type: "reasoning", text: response.thought, state: "streaming" },
              { type: "text", text: "" },
            ],
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStatus("streaming");

          // After 2s mark reasoning done + stream the answer
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantId) return msg;
                return {
                  ...msg,
                  parts: [
                    { type: "reasoning" as const, text: response.thought, state: "done" as const },
                    { type: "text", text: "" },
                  ],
                };
              })
            );
            streamText(
              response.then,
              assistantId,
              setMessages,
              () => setStatus("ready")
            );
          }, 2000);

        } else {
          // Plain text response
          const assistantMsg: ChatMessage = {
            id: assistantId,
            role: "assistant",
            parts: [{ type: "text", text: "" }],
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStatus("streaming");
          streamText(response.text, assistantId, setMessages, () =>
            setStatus("ready")
          );
        }
      }, 600);
    },
    []
  );

  const handleOpenArtifact = useCallback((artifact: CodeArtifact) => {
    setOpenArtifact(artifact);
  }, []);

  const handleCloseArtifact = useCallback(() => {
    setOpenArtifact(null);
  }, []);

  return (
    <div className="flex h-dvh w-full flex-col bg-sidebar">
    
      <div className="relative flex min-h-0 flex-1 overflow-hidden bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">
        {/* Chat area */}
        <div className="flex min-h-0 flex-1 flex-col">
          <Messages
            chatId={chatId}
            isLoading={status === "submitted"}
            isReadonly={false}
            messages={messages}
            onOpenArtifact={handleOpenArtifact}
            status={status}
          />

          <div className="sticky bottom-0 z-10 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
            <MultimodalInput
              attachments={attachments}
              chatId={chatId}
              input={input}
              messages={messages}
              sendMessage={sendMessage}
              setAttachments={setAttachments}
              setInput={setInput}
              status={status}
              stop={stop}
            />
          </div>
        </div>

        <ArtifactSidebar artifact={openArtifact} onClose={handleCloseArtifact} />
      </div>
    </div>
  );
}

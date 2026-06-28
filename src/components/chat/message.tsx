"use client";

import Image from "next/image";
import type { ChatMessage, CodeArtifact, CodeToolPart, WeatherToolPart } from "@/lib/types";
import { cn, sanitizeText } from "@/lib/utils";
import { MessageContent, MessageResponse } from "../ai-elements/message";
import { Shimmer } from "../ai-elements/shimmer";
import { SparklesIcon } from "./icons";
import { MessageActions } from "./message-actions";
import { WeatherCard, WeatherToolLoading } from "./weather";
import { CodeToolCard } from "./artifact-panel";
import { MessageReasoning } from "./message-reasoning";

export const PreviewMessage = ({
  chatId,
  message,
  isLoading,
  isReadonly,
  onEdit,
  onOpenArtifact,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  isReadonly: boolean;
  onEdit?: (message: ChatMessage) => void;
  onOpenArtifact?: (artifact: CodeArtifact) => void;
}) => {
  const fileParts = message.parts.filter((p) => p.type === "file");
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const hasAnyContent = message.parts?.some(
    (part) =>
      (part.type === "text" && (part as { type: "text"; text: string }).text?.trim().length > 0) ||
      (part.type === "reasoning" && (part as { type: "reasoning"; text: string }).text?.trim().length > 0) ||
      part.type === "tool-weather" ||
      part.type === "tool-code"
  );
  const isThinking = isAssistant && isLoading && !hasAnyContent;

  const mergedReasoning = message.parts?.reduce(
    (acc, part) => {
      if (part.type === "reasoning" && (part as { type: "reasoning"; text: string }).text?.trim().length > 0) {
        const rp = part as { type: "reasoning"; text: string; state: "streaming" | "done" };
        return {
          text: acc.text ? `${acc.text}\n\n${rp.text}` : rp.text,
          isStreaming: rp.state === "streaming",
          rendered: false,
        };
      }
      return acc;
    },
    { text: "", isStreaming: false, rendered: false }
  ) ?? { text: "", isStreaming: false, rendered: false };

  const attachments = fileParts.length > 0 && (
    <div className="flex flex-row justify-end gap-2">
      {fileParts.map((part, i) => {
        if (part.type !== "file") return null;
        const filePart = part as { type: "file"; url: string; filename?: string; mediaType: string };
        return filePart.mediaType?.startsWith("image") ? (
          <div
            className="relative h-24 w-24 overflow-hidden rounded-xl border border-border/40"
            key={i}
          >
            <Image
              alt={filePart.filename ?? "attachment"}
              className="size-full object-cover"
              height={96}
              src={filePart.url}
              width={96}
            />
          </div>
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-xl border border-border/40 bg-muted text-xs text-muted-foreground"
            key={i}
          >
            File
          </div>
        );
      })}
    </div>
  );

  const parts = message.parts?.map((part, index) => {
    const key = `message-${message.id}-part-${index}`;

    if (part.type === "reasoning") {
      if (!mergedReasoning.rendered && mergedReasoning.text) {
        mergedReasoning.rendered = true;
        return (
          <MessageReasoning
            isLoading={isLoading || mergedReasoning.isStreaming}
            key={key}
            reasoning={mergedReasoning.text}
          />
        );
      }
      return null;
    }

    if (part.type === "tool-weather") {
      const weatherPart = part as WeatherToolPart;
      return (
        <div key={key}>
          {weatherPart.state === "loading" || !weatherPart.output ? (
            <WeatherToolLoading />
          ) : (
            <WeatherCard data={weatherPart.output} />
          )}
        </div>
      );
    }

    if (part.type === "tool-code") {
      const codePart = part as CodeToolPart;
      const placeholderArtifact = {
        id: codePart.toolCallId,
        title: codePart.output?.title ?? "Code",
        language: codePart.output?.language ?? "typescript",
        content: codePart.output?.content ?? "",
      };
      return (
        <div key={key}>
          <CodeToolCard
            artifact={placeholderArtifact}
            isStreaming={codePart.state === "loading"}
            onClick={
              codePart.output && onOpenArtifact
                ? () => onOpenArtifact(codePart.output!)
                : () => {}
            }
          />
        </div>
      );
    }

    if (part.type !== "text") return null;

    const textPart = part as { type: "text"; text: string };

    return (
      <MessageContent
        className={cn("text-[13px] leading-[1.65]", {
          "w-fit max-w-[min(80%,56ch)] overflow-hidden wrap-break-word rounded-2xl rounded-br-lg border border-border/30 bg-linear-to-br from-secondary to-muted px-3.5 py-2 shadow-sm":
            message.role === "user",
        })}
        data-testid="message-content"
        key={key}
      >
        <MessageResponse>{sanitizeText(textPart.text)}</MessageResponse>
      </MessageContent>
    );
  });

  const actions = !isReadonly && (
    <MessageActions
      chatId={chatId}
      isLoading={isLoading}
      key={`action-${message.id}`}
      message={message}
      onEdit={onEdit ? () => onEdit(message) : undefined}
    />
  );

  const content = isThinking ? (
    <div className="flex h-[21.45px] items-center text-[13px] leading-[1.65]">
      <Shimmer className="font-medium" duration={1}>
        Thinking...
      </Shimmer>
    </div>
  ) : (
    <>
      {attachments}
      {parts}
      {actions}
    </>
  );

  return (
    <div
      className={cn(
        "group/message w-full",
        !isAssistant && "animate-[fade-up_0.25s_cubic-bezier(0.22,1,0.36,1)]"
      )}
      data-role={message.role}
      data-testid={`message-${message.role}`}
    >
      <div
        className={cn(
          isUser ? "flex flex-col items-end gap-2" : "flex items-start gap-3"
        )}
      >
        {isAssistant && (
          <div className="flex h-[21.45px] shrink-0 items-center">
            <div className="flex size-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground ring-1 ring-border/50">
              <SparklesIcon size={13} />
            </div>
          </div>
        )}
        {isAssistant ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2">{content}</div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export const ThinkingMessage = () => (
  <div
    className="group/message w-full"
    data-role="assistant"
    data-testid="message-assistant-loading"
  >
    <div className="flex items-start gap-3">
      <div className="flex h-[21.45px] shrink-0 items-center">
        <div className="flex size-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground ring-1 ring-border/50">
          <SparklesIcon size={13} />
        </div>
      </div>
      <div className="flex h-[21.45px] items-center text-[13px] leading-[1.65]">
        <Shimmer className="font-medium" duration={1}>
          Thinking...
        </Shimmer>
      </div>
    </div>
  </div>
);

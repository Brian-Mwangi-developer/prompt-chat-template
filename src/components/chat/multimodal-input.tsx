"use client";

import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import type { Attachment, ChatMessage, ChatStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import equal from "fast-deep-equal";
import {
    ArrowUpIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
    type ChangeEvent,
    type Dispatch,
    memo,
    type SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import {
    type SlashCommand,
    SlashCommandMenu,
    slashCommands,
} from "./slash-commands";
import { SuggestedActions } from "./suggested-actions";

type SendMessageFn = (message: { role: "user"; parts: ChatMessage["parts"] }) => void;

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  sendMessage,
  className,
}: {
  chatId: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  status: ChatStatus;
  stop: () => void;
  attachments: Attachment[];
  setAttachments: Dispatch<SetStateAction<Attachment[]>>;
  messages: ChatMessage[];
  sendMessage: SendMessageFn;
  className?: string;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const hasAutoFocused = useRef(false);

  useEffect(() => {
    if (!hasAutoFocused.current && width) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
        hasAutoFocused.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [width]);

  const [localStorageInput, setLocalStorageInput] = useLocalStorage("chat-input", "");

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;
    setInput(val);

    if (val.startsWith("/") && !val.includes(" ")) {
      setSlashOpen(true);
      setSlashQuery(val.slice(1));
      setSlashIndex(0);
    } else {
      setSlashOpen(false);
    }
  };

  const handleSlashSelect = useCallback(
    (cmd: SlashCommand) => {
      setSlashOpen(false);
      setInput("");
      switch (cmd.action) {
        case "clear":
          break;
        case "theme":
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          break;
        default:
          break;
      }
    },
    [setTheme, resolvedTheme, setInput]
  );

  const submitForm = useCallback(() => {
    if (!input.trim() && attachments.length === 0) {
      return;
    }
    sendMessage({
      role: "user",
      parts: [
        ...attachments.map((attachment) => ({
          type: "file" as const,
          url: attachment.url,
          filename: attachment.name,
          mediaType: attachment.contentType,
        })),
        {
          type: "text" as const,
          text: input,
        },
      ],
    });

    setAttachments([]);
    setLocalStorageInput("");
    setInput("");

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    input,
    setInput,
    attachments,
    sendMessage,
    setAttachments,
    setLocalStorageInput,
    width,
  ]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      setUploadQueue(files.map((file) => file.name));

      const newAttachments: Attachment[] = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        contentType: file.type,
      }));

      setAttachments((current) => [...current, ...newAttachments]);
      setUploadQueue([]);
    },
    [setAttachments]
  );

  return (
    <div className={cn("relative flex w-full flex-col gap-4", className)}>
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <SuggestedActions chatId={chatId} sendMessage={sendMessage} />
        )}

      <input
        className="pointer-events-none fixed -top-4 -left-4 size-0.5 opacity-0"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        tabIndex={-1}
        type="file"
        aria-label="Upload files"
        title="Upload files"
      />

      <div className="relative">
        {slashOpen && (
          <SlashCommandMenu
            onClose={() => setSlashOpen(false)}
            onSelect={handleSlashSelect}
            query={slashQuery}
            selectedIndex={slashIndex}
          />
        )}
      </div>

      <InputGroup className="overflow-hidden rounded-2xl border border-border/40 bg-card/70 shadow-sm">
        {(attachments.length > 0 || uploadQueue.length > 0) && (
          <InputGroupAddon
            align="block-start"
            className="flex flex-row gap-2 overflow-x-auto px-3 pt-3"
            style={{ scrollbarWidth: "none" }}
          >
            {attachments.map((attachment) => (
              <PreviewAttachment
                attachment={attachment}
                key={attachment.url}
                onRemove={() => {
                  setAttachments((current) =>
                    current.filter((a) => a.url !== attachment.url)
                  );
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              />
            ))}
            {uploadQueue.map((filename) => (
              <PreviewAttachment
                attachment={{ url: "", name: filename, contentType: "" }}
                isUploading
                key={filename}
              />
            ))}
          </InputGroupAddon>
        )}

        <InputGroupTextarea
          className="min-h-24 text-[13px] leading-relaxed px-4 pt-3.5 pb-1.5 outline-none placeholder:text-foreground"
          data-testid="multimodal-input"
          onChange={handleInput}
          onKeyDown={(e) => {
            if (slashOpen) {
              const filtered = slashCommands.filter((cmd) =>
                cmd.name.startsWith(slashQuery.toLowerCase())
              );
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSlashIndex((i) => Math.min(i + 1, filtered.length - 1));
                return;
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSlashIndex((i) => Math.max(i - 1, 0));
                return;
              }
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                if (filtered[slashIndex]) {
                  handleSlashSelect(filtered[slashIndex]);
                }
                return;
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setSlashOpen(false);
                return;
              }
            }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (status === "ready" || status === "error") {
                submitForm();
              }
            }
          }}
          placeholder="Ask anything..."
          ref={textareaRef}
          value={input}
        />

        <InputGroupAddon
          align="block-end"
          className="justify-between gap-1 px-3 pb-3"
        >
          <div className="flex min-w-0 items-center gap-1">
            <Button
              className="h-8 w-8 rounded-lg border border-border bg-muted p-1.5 text-foreground transition-colors hover:bg-accent"
              data-testid="attachments-button"
              disabled={status !== "ready"}
              onClick={(event) => {
                event.preventDefault();
                fileInputRef.current?.click();
              }}
              variant="ghost"
              type="button"
            >
              <PaperclipIcon size={15} style={{ width: 15, height: 15 }} />
            </Button>
          </div>

          {status === "submitted" || status === "streaming" ? (
            <Button
              className="h-7 w-7 rounded-xl bg-foreground p-1 text-background transition-all duration-200 hover:opacity-85 active:scale-95"
              data-testid="stop-button"
              onClick={(event) => {
                event.preventDefault();
                stop();
              }}
              type="button"
            >
              <StopIcon size={14} />
            </Button>
          ) : (
            <InputGroupButton
              aria-label="Submit"
              className={cn(
                "h-8 w-8 rounded-xl transition-all duration-200",
                input.trim()
                  ? "bg-foreground text-background hover:opacity-85 active:scale-95"
                  : "border-2 border-foreground/40 bg-transparent text-foreground/90 cursor-not-allowed"
              )}
              data-testid="send-button"
              disabled={!input.trim() || uploadQueue.length > 0}
              onClick={submitForm}
              type="button"
            >
              <ArrowUpIcon className="size-4" />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;
    if (prevProps.messages.length !== nextProps.messages.length) return false;
    return true;
  }
);

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckIcon,
  ClipboardIcon,
  PlayIcon,
  ChevronLeftIcon,
  XIcon,
  TerminalIcon,
} from "lucide-react";
import {
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import type { CodeArtifact } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CodeBlockContainer,
  CodeBlockContent,
} from "@/components/ai-elements/code-block";
import type { BundledLanguage } from "shiki";

// ─── Inline preview card (in the chat thread) ────────────────────────────────

function CodeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.22 1.47a.75.75 0 0 1 1.06.06l4 4.5a.75.75 0 0 1 0 1l-4 4.5a.75.75 0 1 1-1.12-1l3.47-3.9-3.47-3.9a.75.75 0 0 1 .06-1.06ZM5.78 1.47a.75.75 0 0 1 .06 1.06L2.37 6.43l3.47 3.9a.75.75 0 1 1-1.12 1l-4-4.5a.75.75 0 0 1 0-1l4-4.5a.75.75 0 0 1 1.06-.06ZM8.5 1a.75.75 0 0 1 .47.95l-3 9a.75.75 0 0 1-1.42-.48l3-9A.75.75 0 0 1 8.5 1Z"
      />
    </svg>
  );
}

function FullscreenIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 1h4v1.5h-2.5v2.5h-1.5v-4ZM10.5 1h4v4h-1.5v-2.5h-2.5v-1.5ZM1 10.5h1.5v2.5h2.5v1.5h-4v-4ZM13 13h-2.5v1.5h4v-4h-1.5v2.5Z"
      />
    </svg>
  );
}

// Skeleton shimmer for inline card loading
function InlineCodeSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[80, 60, 90, 50, 70].map((w, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-muted-foreground/10"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export const CodeDocumentPreview = memo(function CodeDocumentPreview({
  artifact,
  isStreaming,
  onClick,
}: {
  artifact: CodeArtifact;
  isStreaming: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative w-full max-w-112.5 cursor-pointer">
      {/* Invisible hitbox overlay */}
      <div
        aria-label={`Open ${artifact.title}`}
        className="absolute inset-0 z-10 rounded-2xl"
        onClick={onClick}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        role="button"
        tabIndex={0}
      >
        <div className="flex w-full items-center justify-end p-4">
          <div className="absolute top-3.25 right-2.25 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <FullscreenIcon size={14} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 rounded-t-2xl border border-b-0 border-border/50 bg-muted/40 px-4 py-3 dark:bg-muted">
        <div className="flex items-center gap-2.5">
          <div className="text-muted-foreground">
            {isStreaming ? (
              <div className="size-3.5 animate-pulse rounded-full bg-muted-foreground/40" />
            ) : (
              <CodeIcon size={14} />
            )}
          </div>
          <span className="text-sm font-medium">{artifact.title}</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Code preview (fixed height, fades out at bottom) */}
      <div className="relative h-64.25 overflow-hidden rounded-b-2xl border border-t-0 border-border/50 bg-muted/20 dark:bg-muted">
        {isStreaming ? (
          <InlineCodeSkeleton />
        ) : (
          <div className="pointer-events-none absolute inset-0">
            <CodeBlockContainer
              className="h-full rounded-none border-0 bg-transparent"
              language={artifact.language}
            >
              <CodeBlockContent
                code={artifact.content}
                language={artifact.language as BundledLanguage}
                showLineNumbers
              />
            </CodeBlockContainer>
          </div>
        )}
        {/* Fade gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-muted to-transparent dark:from-muted" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-muted to-transparent dark:from-muted" />
      </div>
    </div>
  );
});


type ToolbarAction = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function ArtifactToolbar({
  onClose,
  actions,
}: {
  onClose: () => void;
  actions: ToolbarAction[];
}) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="fixed right-6 bottom-6 z-50 flex cursor-pointer flex-col items-center rounded-3xl border border-border/50 bg-background py-1 shadow-lg"
        exit={{ opacity: 0, y: -20, transition: { duration: 0.1 } }}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        onAnimationComplete={() => setIsAnimating(false)}
        onAnimationStart={() => setIsAnimating(true)}
        ref={toolbarRef}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Close button at top */}
        <motion.div
          animate={{ opacity: 1 }}
          className="p-3 text-muted-foreground transition-colors hover:text-foreground"
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </motion.div>

        {/* Action buttons */}
        {actions.map((action) => (
          <Tooltip key={action.label} open={isAnimating ? false : undefined}>
            <TooltipTrigger asChild>
              <motion.button
                animate={{ opacity: 1, transition: { delay: 0.05 } }}
                className={cn(
                  "rounded-full p-3 text-muted-foreground transition-colors hover:text-foreground",
                  "disabled:pointer-events-none disabled:opacity-30"
                )}
                disabled={action.disabled}
                exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.1 } }}
                initial={{ scale: 1, opacity: 0 }}
                onClick={action.onClick}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {action.icon}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent
              className="rounded-2xl bg-foreground px-4 py-3 text-background"
              side="left"
              sideOffset={16}
            >
              {action.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}

export function ArtifactSidebar({
  artifact,
  onClose,
}: {
  artifact: CodeArtifact | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const handleCopy = useCallback(async () => {
    if (!artifact) return;
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [artifact]);

  const handleRun = useCallback(() => {
    setConsoleOutput("// Output:\nconsole: Program executed successfully.\n> Result: { status: 'ok' }");
  }, []);

  const handlePrevVersion = useCallback(() => {
    // Demo only — no real version history
  }, []);

  const toolbarActions: ToolbarAction[] = [
    {
      icon: <PlayIcon className="size-4" />,
      label: "Execute Code",
      onClick: handleRun,
      disabled: !artifact,
    },
    {
      icon: <ChevronLeftIcon className="size-4" />,
      label: "Previous version",
      onClick: handlePrevVersion,
      disabled: true,
    },
    {
      icon: copied ? <CheckIcon className="size-4" /> : <ClipboardIcon className="size-4" />,
      label: copied ? "Copied!" : "Copy to clipboard",
      onClick: handleCopy,
      disabled: !artifact,
    },
    {
      icon: <TerminalIcon className="size-4" />,
      label: "Add logs",
      onClick: handleRun,
      disabled: !artifact,
    },
  ];

  return (
    <div
      className={cn(
        "h-dvh shrink-0 flex-col overflow-hidden border-l border-border/50 bg-sidebar transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        artifact ? "flex w-[50%]" : "w-0"
      )}
    >
      {artifact && (
        <>
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-4">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={onClose}
                type="button"
                aria-label="Close"
              >
                <XIcon className="size-4" />
              </button>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold leading-tight">{artifact.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{artifact.language}</p>
              </div>
            </div>
          </div>

          {/* Code content */}
          <div className="relative min-h-0 flex-1 overflow-y-auto bg-background">
            <CodeBlockContainer
              className="h-full min-h-full rounded-none border-0"
              language={artifact.language}
            >
              <CodeBlockContent
                code={artifact.content}
                language={artifact.language as BundledLanguage}
                showLineNumbers
              />
            </CodeBlockContainer>
          </div>

          {/* Console output (shown after Run) */}
          <AnimatePresence>
            {consoleOutput && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                className="shrink-0 border-t border-border/50 bg-muted/50"
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
              >
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground">Console</span>
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setConsoleOutput(null)}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
                <pre className="max-h-32 overflow-auto px-4 pb-3 font-mono text-[11px] text-foreground/80">
                  {consoleOutput}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating toolbar */}
          <ArtifactToolbar
            actions={toolbarActions}
            onClose={onClose}
          />
        </>
      )}
    </div>
  );
}

// ─── Loading / result tool card (kept for compat, now uses CodeDocumentPreview) ──
export { CodeDocumentPreview as CodeToolCard };

import { cn } from "@/lib/utils";
import { Greeting } from "./greeting";
import { useRef } from "react";
import { ArrowDownIcon } from "lucide-react";


function PureMessages(){
    const messagesContainerRef = useRef<HTMLTextAreaElement>(null)
    return(
        <div className="relative flex-1 bg-background">
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <Greeting/>
            </div>
            <div className={cn(
                "absolute inset-0 touch-pan-y overflow-y-auto bg-background"
            )}>
                <div className="mx-auto flex min-h-full min-w-0 max-w-4xl flex-col gap-5 px-2 py-6 md:gap-7 md:px-4">

                </div>

            </div>
            <button
        aria-label="Scroll to bottom"
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full border border-border/50 bg-card/90 px-3.5 shadow-[var(--shadow-float)] backdrop-blur-lg transition-all duration-200 h-7 text-[10px] pointer-events-auto scale-100 opacity-100"
        onClick={() => scrollToBottom("smooth")}
        type="button"
      >
        <ArrowDownIcon className="size-3 text-muted-foreground" />
      </button>
        </div>
    )
}
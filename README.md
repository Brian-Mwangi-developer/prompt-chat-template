# Prompt Chat Template

A production-ready chat UI template built with Next.js, designed as a starting point for integrating AI models. The UI is fully functional with simulated responses — swap in any AI provider (OpenAI, Anthropic, etc.) to go live.

## Features

- **Streaming chat UI** — character-by-character streamed assistant responses
- **Tool call simulation** — weather cards, code artifacts, and reasoning blocks rendered as structured UI
- **Code artifact panel** — syntax-highlighted code viewer (via shiki) that slides in as a right sidebar, with a floating toolbar for copy, run, and version actions
- **Thinking / reasoning** — collapsible reasoning block that auto-opens while streaming and auto-closes when done, showing elapsed time
- **Weather tool card** — inline weather widget rendered from a simulated tool call
- **Slash commands** — type `/` to open a command menu (`/theme`, `/clear`, `/new`, etc.)
- **File attachments** — attach images or files to messages via the paperclip button
- **Light / dark theme** — toggle via the theme button or `/theme` slash command, powered by `next-themes`
- **Suggested actions** — animated suggestion pills shown when the chat is empty
- **Multimodal input** — textarea with slash command menu, attachment preview, stop/send buttons

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript (strict mode)
- **Styling** — Tailwind CSS v4
- **Components** — shadcn/ui
- **Syntax highlighting** — shiki (`github-light` / `github-dark` themes)
- **Animations** — framer-motion
- **Theme** — next-themes
- **Package manager** — pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the chat UI.

## Connecting an AI Model

All simulated responses live in `src/components/chat/chat-shell.tsx` inside `getSimulatedResponse()` and the `sendMessage` callback. Replace the `setTimeout` / `setInterval` streaming logic with a real API call to any model provider.

The message types in `src/lib/types.ts` are already structured to support:
- `text` parts — plain streamed text
- `reasoning` parts — thinking blocks
- `tool-weather` parts — weather tool results
- `tool-code` parts — code artifact results
- `file` parts — attachments

## Project Structure

```
src/
  app/
    page.tsx                  # Entry point — renders ChatShell
  components/
    ai-elements/              # Low-level UI primitives (shimmer, reasoning, code block)
    chat/
      chat-shell.tsx          # Main layout + simulated response logic
      messages.tsx            # Message list with scroll tracking
      message.tsx             # Per-message renderer (all part types)
      multimodal-input.tsx    # Prompt input box
      artifact-panel.tsx      # Code viewer sidebar + floating toolbar
      weather.tsx             # Weather tool card
      message-reasoning.tsx   # Reasoning/thinking block
      slash-commands.tsx      # Slash command menu
      suggested-actions.tsx   # Empty state suggestion pills
    ui/                       # shadcn/ui components
  lib/
    types.ts                  # Core type definitions
    utils.ts                  # generateUUID, sanitizeText, cn
    constants.ts              # Suggested action strings
```

## License

MIT

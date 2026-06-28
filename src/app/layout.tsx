import { AppSidebar } from "@/components/chat/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = "https://prompt-chat-template.vercel.app";
const TITLE = "Prompt Chat Template — Next.js AI Chat UI";
const DESCRIPTION =
  "An open-source Next.js chat UI template with streaming responses, reasoning blocks, code artifacts, weather tool cards, slash commands, and light/dark theme. Built with shadcn/ui, Tailwind CSS v4, framer-motion, and shiki. Drop in any AI model (OpenAI, Anthropic, Gemini) to go live.";
const KEYWORDS = [
  "Next.js chat UI template",
  "AI chat interface",
  "shadcn chat",
  "streaming chat UI",
  "Next.js AI template",
  "open source chatbot UI",
  "Claude UI",
  "OpenAI chat interface",
  "Anthropic chat template",
  "AI tool call UI",
  "chat artifact panel",
  "reasoning UI",
  "shiki syntax highlighting",
  "framer-motion chat",
  "Tailwind CSS chat",
  "shadcn/ui template",
  "Next.js App Router chat",
];

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITLE,
    template: "%s | Prompt Chat Template",
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "Brian Mwangi", url: "https://github.com/Brian-Mwangi-developer" }],
  creator: "Brian Mwangi",
  openGraph: {
    type: "website",
    url: APP_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Prompt Chat Template",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@BrianMwangi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
         <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
         <TooltipProvider>
          <SidebarProvider>
             <AppSidebar/>
             <SidebarInset>
                {children}
             </SidebarInset> 
          </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
        </body>
    </html>
  );
}

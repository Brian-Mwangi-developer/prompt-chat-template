import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Explicitly allow major AI crawlers
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "GoogleExtended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
    ],
    sitemap: "https://prompt-chat-template.vercel.app/sitemap.xml",
  };
}

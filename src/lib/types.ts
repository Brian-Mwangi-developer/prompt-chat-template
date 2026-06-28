export type MessageRole = "user" | "assistant";

export type TextPart = {
  type: "text";
  text: string;
};

export type FilePart = {
  type: "file";
  url: string;
  filename?: string;
  mediaType: string;
};

export type WeatherData = {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  wind: number;
  high: number;
  low: number;
};

export type WeatherToolPart = {
  type: "tool-weather";
  toolCallId: string;
  state: "loading" | "result";
  output?: WeatherData;
};

export type CodeArtifact = {
  id: string;
  title: string;
  language: string;
  content: string;
};

export type CodeToolPart = {
  type: "tool-code";
  toolCallId: string;
  state: "loading" | "result";
  output?: CodeArtifact;
};

export type ReasoningPart = {
  type: "reasoning";
  text: string;
  state: "streaming" | "done";
};

export type MessagePart =
  | TextPart
  | FilePart
  | WeatherToolPart
  | CodeToolPart
  | ReasoningPart;

export type ChatMessage = {
  id: string;
  role: MessageRole;
  parts: MessagePart[];
  createdAt?: Date;
};

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

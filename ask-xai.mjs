import dotenv from "dotenv";
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

dotenv.config({ path: ".env.local" });

const prompt = process.argv.slice(2).join(" ");

if (!prompt) {
  console.error("Usage: node ask-xai.mjs <prompt>");
  process.exit(1);
}

const result = streamText({
  model: xai("grok-2-1212"),
  prompt,
});

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}

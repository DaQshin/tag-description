import ollama from "ollama";
import { test } from "node:test";
import assert from "node:assert";
import "dotenv/config";

test("Check Ollama[gemma3:1b]", async () => {
  const response = await ollama.chat({
    host: process.env.OLLAMA_HOST,
    model: "gemma3:1b",
    messages: [
      {
        role: "user",
        content: "Reply with exactly: Ready",
      },
    ],
  });

  assert.deepEqual(response.message.content, "Ready");
});

test("Check OpenRouter models", async () => {
  const response = await fetch(process.env.OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: "Reply exactly with the word : 'Ready'",
        },
      ],
    }),
  });

  const data = await response.json();

  assert.deepEqual(data.choices[0].message.content, "Ready");
});

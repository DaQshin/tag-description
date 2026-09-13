import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(__dirname, "..", "prompts", "classify-image-description-v1.md"),
  "utf-8",
);

const callModel = async (description, optional = null) => {
  let messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },

    {
      role: "user",
      content: description,
    },
  ];

  if (optional) {
    const { brokenOutput, validationError } = optional;

    if (!brokenOutput && !validationError)
      throw new Error("Field brokenOutput is missing");

    const repairInstruction = [
      `Your previous answer was rejected for this reason: ${validationError}`,
      `Previous (invalid) answer: ${brokenOutput}`,
      "Return only corrected JSON matching the schema. No preamble, no code fences.",
    ].join("\n\n");

    messages.push({
      role: "assistant",
      content: repairInstruction,
    });
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        temperature: 0,
        response_format: { type: "json_object" },
        messages,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  console.log(content);

  return JSON.parse(content);
};

export { callModel };

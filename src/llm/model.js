import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

console.log(process.env.OPENROUTER_API_KEY);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(__dirname, "..", "prompts", "classify-image-description-v1.md"),
  "utf-8",
);

const callModel = async (description) => {
  try {
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
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },

            {
              role: "user",
              content: description,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (err) {
    throw err;
  }
};

export { callModel };

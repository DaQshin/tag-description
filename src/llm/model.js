import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cacheKey, loadCache, saveCache } from "./cache.js";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(__dirname, "..", "prompts", "classify-image-description-v1.md"),
  "utf-8",
);

const callModel = async (description, optional = null) => {
  const cache = loadCache();

  const key = cacheKey(description);

  if (cache[key]) {
    console.log(JSON.stringify({ cacheHit: true, result: cache[key] }));
    return JSON.parse(cache[key]);
  }

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  let content = "";

  try {
    const startTime = Date.now();
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

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // console.log(data.choices[0].message);

    if (data.finish_reason === "content_filter") {
      throw new Error("MODEL_REFUSAL: content filtered");
    } else if (!data.choices[0].message.content) {
      throw new Error("MODEL_REFUSAL: empty content");
    } else if (data.choices[0].message.refusal) {
      throw new Error("MODEL_REFUSAL: model refused to answer");
    }

    console.log(
      JSON.stringify({
        model: data.model,
        prompt_version: "v1",
        usage: {
          input_tokens: data?.usage.prompt_tokens,
          output_tokens: data?.usage.completion_tokens,
          cost: data?.usage.cost,
        },
        duration,
        repair: optional !== null,
      }),
    );
    content = data.choices[0].message.content;

    cache[key] = content;
    saveCache(cache);

    clearTimeout(timeoutId);
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") throw new Error("MODEL_TIMEOUT");
    throw err;
  }

  //   console.log(content);
  return JSON.parse(content);
};

export { callModel };

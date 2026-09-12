import ollama from "ollama";
import "dotenv/config";

async function checkOllama() {
  try {
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

    console.log("Response:", response.message.content);
  } catch (error) {
    console.error("Ollama error:", error);
  }
}

async function checkOpenRouter() {
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
        messages: [
          {
            role: "user",
            content: "Reply exactly with the word : 'Ready'",
          },
        ],
      }),
    },
  );

  console.log(response);
}

checkOllama().catch((err) => console.log(err));
checkOpenRouter().catch((err) => console.log(err));

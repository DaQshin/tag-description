const express = require("express");
const app = express();

app.use(express.json());

fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
    "HTTP-Referer": "<YOUR_SITE_URL>",
    "X-Title": "<YOUR_SITE_NAME>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?",
      },
    ],
  }),
});

module.exports = app;

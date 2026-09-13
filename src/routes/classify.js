import express from "express";
import fs from "fs";
import { callModel } from "../llm/model.js";
import { InputSchema, OutputSchema, STUB_OUTPUT } from "../llm/schema.js";

const router = express.Router();

const generateTag = async (req, res) => {
  if (process.env.LLM_ENABLED === "false") {
    console.log("llm disabled");
    return res.status(503).json({
      error: "llm_disabled",
    });
  }

  const parsed = InputSchema.safeParse(req.body);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return res.status(400).json({
      error: "invalid_input",
      field: issue.path.join(" "),
      message: issue.message,
    });
  }

  try {
    let output;

    if (process.env.LLM_STUB === "1") {
      output = STUB_OUTPUT;
    } else {
      output = await callModel(parsed.data.description);
    }

    let parsedOutput = OutputSchema.safeParse(output);

    console.log("parsed output : ", parsedOutput);

    if (!parsedOutput.success) {
      console.log("retry");
      output = await callModel(parsed.data.description, {
        brokenOutput: output,
        validationError: parsedOutput.error,
      });

      parsedOutput = OutputSchema.safeParse(output);

      if (!parsedOutput.success) {
        fs.appendFileSync(
          "logs/quarantine.jsonl",
          JSON.stringify({
            timestamp: new Date().toISOString(),
            input: parsed.data.description,
            output,
            error: parsedOutput.error,
            prompt_version: "v1",
          }) + "\n",
        );

        return res.status(422).json({
          error: "classification_failed",
          message: parsedOutput.error,
        });
      }
    }

    return res.json({
      result: parsedOutput.data,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "internal_error", message: err.message });
  }
};

router.post("/classify", generateTag);

export { router };

import express from "express";
import { callModel } from "../llm/model.js";
import { InputSchema, OutputSchema, STUB_OUTPUT } from "../llm/schema.js";

const router = express.Router();

router.route("/classify").post(async (req, res) => {
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

    const validateResponse = OutputSchema.parse(output);
    return res.status(200).json(validateResponse);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "internal_error", message: err.message });
  }
});

export { router };

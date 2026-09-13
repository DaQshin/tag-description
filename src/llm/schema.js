import { z } from "zod";

const InputSchema = z.object({
  description: z
    .string()
    .min(5, {
      error: "Description must at least be 5 characters long",
    })
    .max(300, {
      error: "Text size exceeded (limit : 300 characters)",
    })
    .trim(),
});

const OutputSchema = z.object({
  category: z.string(),
  subject: z.string(),
  confidence: z.number().min(0.0).max(1.0),
  needs_review: z.boolean().default(false),
});

const STUB_OUTPUT = {
  category: "general",
  subject: "stub subject",
  confidence: 0.5,
  needs_review: false,
};

export { InputSchema, OutputSchema, STUB_OUTPUT };

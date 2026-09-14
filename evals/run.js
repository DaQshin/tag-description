import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "node:assert";
import { test } from "node:test";

import { callModel } from "../src/llm/model.js";

async function runEvals() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const cases = JSON.parse(fs.readFileSync(path.join(__dirname, "cases.json")));

  for (let i = 0; i < cases.length; i++) {
    test(`case_id-${cases[i].id} description- ${cases[i].description}`, async () => {
      const response = await callModel(cases[i].description);

      assert.deepEqual(response.category, cases[i].expected_category);
    });
  }
}

runEvals().catch((err) => console.log(err));

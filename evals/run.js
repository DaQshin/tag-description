import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "node:assert";
import { test } from "node:test";

import { callModel } from "../src/llm/model.js";

async function runEvals() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const cases = JSON.parse(fs.readFileSync(path.join(__dirname, "cases.json")));

  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const reset = "\x1b[0m";

  for (let i = 0; i < cases.length; i++) {
    const response = await callModel(cases[i].description);

    if (response.category === cases[i].expected_category) {
      console.log(
        `${green} case_id [${cases[i].id}] \n ${JSON.stringify(response)}` +
          reset,
      );
    } else {
      console.log(
        `${red} case_id [${cases[i].id}] \n ${JSON.stringify(response)}` +
          reset,
      );
    }
  }
}

runEvals().catch((err) => console.log(err));

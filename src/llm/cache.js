import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { createHash } from "crypto";

const PROMPT_VERSION = "v1";

const cacheKey = (description) => {
  createHash("sha256")
    .update(JSON.stringify({ description, prompt_version: PROMPT_VERSION }))
    .digest("hex");
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.join(
  __dirname,
  "..",
  "..",
  ".cache",
  "classify-cache.json",
);

const loadCache = () => {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
  } catch (err) {
    return {};
  }
};

const saveCache = (cache) => {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
};

export { cacheKey, loadCache, saveCache };

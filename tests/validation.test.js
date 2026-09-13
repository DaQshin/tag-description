// test/classify.test.js
import { test } from "node:test";
import assert from "node:assert";
import express from "express";
import request from "supertest";

test("check mock", (t) => {
  console.log(t.mock);
});

test("check mock", (t) => {
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(t.mock)));
});

import { test } from "node:test";
import assert from "node:assert";
import express from "express";
import request from "supertest";

test("validation: rejects description under 5 characters", async () => {
  const { router } = await import("../src/routes/classify.js");

  const app = express();

  app.use(express.json());
  app.use(router);

  const res = await request(app).post("/classify").send({ description: "hi" });

  assert.equal(res.status, 400);
  assert.equal(res.body.error, "invalid_input");
});

import express from "express";
import morgan from "morgan";
import { router } from "./routes/classify.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", router);

export { app };

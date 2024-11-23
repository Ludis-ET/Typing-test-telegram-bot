import express from "express";
import "./db/connect";

const app = express();
app.use(express.json());

export default app;

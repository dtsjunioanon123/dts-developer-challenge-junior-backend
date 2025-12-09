import express, { NextFunction, Request, Response } from "express";

import bodyParser from "body-parser";

import tasksRouter from "./routes/tasks.router";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// CORS OPTIONS

app.use(corsOptions);

// PARSING MIDDLEWARE

app.use(bodyParser.json());

// ROUTING

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Task Manager API LIVE");
});

app.use("/tasks", tasksRouter);

// ERRORS MIDDLEWARE

app.use(errorHandler);

// EXPORT

export default app;

/**
 * Express router for handling task-related HTTP endpoints.
 *
 * @remarks
 * This router exposes CRUD operations for task management, including:
 * - Creating tasks
 * - Retrieving tasks
 * - Updating tasks
 * - Deleting tasks
 *
 * Each route delegates business logic to the corresponding controller functions.
 *
 */

import express from "express";
import * as controller from "../controllers/tasks.controller";

const tasksRouter = express.Router();

tasksRouter.post("/", controller.createTask);

export default tasksRouter;

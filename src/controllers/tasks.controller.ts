/**
 * @file controllers/task.controller.ts
 * @description
 * Controller for managing tasks. Includes CRUD operations for tasks, with
 * full validation of input data, error handling, and integration with the
 * task model. Errors thrown are custom errors (`MissingValueError`,
 * `InvalidValueError`) which are handled by a global error handler middleware.
 *
 * Validation rules:
 * - `title` and `description` are required and have maximum lengths.
 * - `status` must be one of `pending`, `in_progress`, `completed`.
 * - `due_datetime` must be a valid ISO 8601 date string.
 *
 * Database errors such as unique constraint violations on `title` are handled
 * by the error handler middleware.
 *
 * Example usage:
 * ```ts
 * import { Router } from "express";
 * import { createTask } from "../controllers/task.controller";
 *
 * const router = Router();
 * router.post("/tasks", createTask);
 * ```
 */

import { Request, Response, NextFunction } from "express";
import * as model from "../models/task.model";
import { MissingValueError, InvalidValueError } from "../errors/AppErrors";

const MAX_TITLE_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 5;

/**
 * Create a new task.
 *
 * Validates incoming task data and inserts it into the database if valid.
 * Throws:
 * - `MissingValueError` if any required field (`title`, `description`, `status`, `due_datetime`) is missing.
 * - `InvalidValueError` if:
 *    - `title` or `description` exceeds max length
 *    - `status` is not one of allowed values
 *    - `due_datetime` is not a valid date
 *
 * @param req - Express request object containing task fields in `req.body`.
 * @param res - Express response object used to send success or error responses.
 * @param next - Express next function for error handling.
 *
 * @returns {JSON} 201 Created with the created task on success.
 *
 */
export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, status, due_datetime } = req.body;

    // Required fields
    if (!title) throw new MissingValueError("title");
    if (!description) throw new MissingValueError("description");
    if (!status) throw new MissingValueError("status");
    if (!due_datetime) throw new MissingValueError("due_datetime");

    // Length checks
    if (title.length > MAX_TITLE_LENGTH) {
      throw new InvalidValueError(
        "title",
        `title must be <= ${MAX_TITLE_LENGTH} characters`
      );
    }

    if (description.length < MIN_DESCRIPTION_LENGTH) {
      throw new InvalidValueError(
        "description",
        `Description must be more than ${MIN_DESCRIPTION_LENGTH} characters`
      );
    }

    // Status validation
    const allowedStatuses = ["pending", "in_progress", "completed"];
    if (!allowedStatuses.includes(status)) {
      throw new InvalidValueError("status", "Invalid status value");
    }

    // Date validation
    let parsedDate;
    try {
      parsedDate = new Date(due_datetime).toISOString();
    } catch {
      throw new InvalidValueError("due_datetime", "Invalid date format");
    }

    const newTask = await model.insertTask({
      title,
      description,
      status,
      due_datetime: parsedDate,
    });

    return res.status(201).json({ task: newTask });
  } catch (err) {
    next(err); // passes to errorHandler
  }
}

/**
 * @file task.model.ts
 * @description
 * This module contains database operations related to tasks.
 *
 * It provides functions to insert tasks into the `tasks` table while
 * handling database errors gracefully using custom application errors:
 * - `ConstraintError` for unique constraint violations (e.g., duplicate titles)
 * - `DatabaseConnectionError` for database connection failures
 * - `DatabaseError` for any other database-related issues
 *
 * All functions throw instances of these errors, which can be caught
 * and handled in controllers or global error handlers.
 */

import format from "pg-format";
import db from "../db/dbConnection";
import {
  ConstraintError,
  DatabaseConnectionError,
  DatabaseError,
} from "../errors/AppErrors";

/**
 * Inserts a new task into the `tasks` table.
 *
 * @param new_task - An object containing the task fields:
 *   - `title`: The task title (must be unique).
 *   - `description`: A detailed task description.
 *   - `status`: The task status ("pending", "in_progress", or "completed").
 *   - `due_datetime`: An ISO-8601 formatted timestamp indicating when the task is due.
 *
 * @returns A Promise that resolves to the inserted task record, including:
 *   `id`, `title`, `description`, `status`, and `due_datetime`.
 *
 * @throws {ConstraintError} If a task with the same title already exists.
 * @throws {DatabaseConnectionError} If the database connection fails.
 * @throws {DatabaseError} For any other database-related errors.
 *
 */
export const insertTask = async (new_task: Record<string, string>) => {
  const query = format(
    `INSERT INTO tasks (title, description, status, due_datetime) 
     VALUES %L
     RETURNING id, title, description, status, due_datetime`,
    [Object.values(new_task)]
  );

  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch (err: any) {
    // Connection error
    if (err.code === "ECONNREFUSED") {
      throw new DatabaseConnectionError(err);
    }

    // Unique constraint (duplicate title)
    if (err.code === "23505" && err.constraint === "tasks_title_key") {
      throw new ConstraintError(
        "A task with this title already exists",
        err.constraint
      );
    }

    // Any other DB issue
    throw new DatabaseError(err.message, err);
  }
};

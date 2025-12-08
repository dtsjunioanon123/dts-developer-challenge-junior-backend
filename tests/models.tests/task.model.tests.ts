import "../../src/config/env";
// task.model.test.ts

import { insertTask } from "../../src/models/task.model";
import db from "../../src/db/dbConnection";
import {
  ConstraintError,
  DatabaseConnectionError,
  DatabaseError,
} from "../../src/errors/AppErrors";

// Mock db connection entirely
jest.mock("../../src/db/dbConnection");

describe("Task Model — insertTask()", () => {
  const mockTask = {
    title: "Test Task",
    description: "Test Description",
    status: "pending",
    due_datetime: "2024-12-31T23:59:59Z",
  };

  const mockResult = {
    id: 1,
    ...mockTask,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------------
  // SUCCESS CASE
  // ------------------------------------
  it("should insert a new task and return the created task", async () => {
    (db.query as jest.Mock).mockResolvedValue({ rows: [mockResult] });

    const result = await insertTask(mockTask);

    expect(result).toEqual(mockResult);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  // ------------------------------------
  // DUPLICATE KEY (UNIQUE CONSTRAINT)
  // ------------------------------------
  it("should throw ConstraintError when task title already exists", async () => {
    const error = new Error("duplicate key");
    (error as any).code = "23505"; // Postgres unique violation
    (error as any).constraint = "tasks_title_key";

    (db.query as jest.Mock).mockRejectedValue(error);

    await expect(insertTask(mockTask)).rejects.toThrow(ConstraintError);
  });

  // ------------------------------------
  // CONNECTION REFUSED
  // ------------------------------------
  it("should throw DatabaseConnectionError when DB connection refuses", async () => {
    const error = new Error("Connection refused");
    (error as any).code = "ECONNREFUSED";

    (db.query as jest.Mock).mockRejectedValue(error);

    await expect(insertTask(mockTask)).rejects.toThrow(DatabaseConnectionError);
  });

  // ------------------------------------
  // UNKNOWN DB ERROR
  // ------------------------------------
  it("should throw DatabaseError for any other DB error", async () => {
    const error = new Error("Something unknown");
    (error as any).code = "123_HUH";

    (db.query as jest.Mock).mockRejectedValue(error);

    await expect(insertTask(mockTask)).rejects.toThrow(DatabaseError);
  });
});

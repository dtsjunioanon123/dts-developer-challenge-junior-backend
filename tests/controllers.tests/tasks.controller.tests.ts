import "../../src/config/env";
import { Request, Response, NextFunction } from "express";
import { createTask } from "../../src/controllers/tasks.controller";
import * as model from "../../src/models/task.model";

import {
  MissingValueError,
  InvalidValueError,
  ConstraintError,
} from "../../src/errors/AppErrors";

jest.mock("../../src/models/task.model");

describe("createTask Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  // -----------------------------------------------------
  // SUCCESS CASE
  // -----------------------------------------------------
  it("creates a task successfully and returns 201 + task", async () => {
    const validBody = {
      title: "Test",
      description: "Some description",
      status: "pending",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    req.body = validBody;

    const parsedISO = new Date(validBody.due_datetime).toISOString();
    const mockTask = { id: 1, ...validBody, due_datetime: parsedISO };

    (model.insertTask as jest.Mock).mockResolvedValue(mockTask);

    await createTask(req as Request, res as Response, next);

    expect(model.insertTask).toHaveBeenCalledWith({
      ...validBody,
      due_datetime: parsedISO,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ task: mockTask });
    expect(next).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------
  // REQUIRED FIELD TESTS
  // -----------------------------------------------------
  it("throws MissingValueError when title is missing", async () => {
    req.body = {
      description: "desc",
      status: "pending",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(MissingValueError));
  });

  it("throws MissingValueError when description is missing", async () => {
    req.body = {
      title: "Test",
      status: "pending",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(MissingValueError));
  });

  it("throws MissingValueError when status is missing", async () => {
    req.body = {
      title: "Test",
      description: "desc",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(MissingValueError));
  });

  it("throws MissingValueError when due_datetime is missing", async () => {
    req.body = {
      title: "Test",
      description: "Valid desc",
      status: "pending",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(MissingValueError));
  });

  // -----------------------------------------------------
  // INVALID FIELD TESTS
  // -----------------------------------------------------
  it("throws InvalidValueError for too long title", async () => {
    req.body = {
      title: "a".repeat(101),
      description: "Valid desc",
      status: "pending",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(InvalidValueError));
  });

  it("throws InvalidValueError for too short description", async () => {
    req.body = {
      title: "Test",
      description: "abc",
      status: "pending",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(InvalidValueError));
  });

  it("throws InvalidValueError for invalid status", async () => {
    req.body = {
      title: "Test",
      description: "Valid desc",
      status: "SOMETHING_ELSE",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(InvalidValueError));
  });

  it("throws InvalidValueError for invalid datetime", async () => {
    req.body = {
      title: "Test",
      description: "Valid desc",
      status: "pending",
      due_datetime: "invalid-date",
    };

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(InvalidValueError));
  });

  // -----------------------------------------------------
  // MODEL ERROR PASS-THROUGH
  // -----------------------------------------------------
  it("forwards ConstraintError from model.insertTask to next()", async () => {
    const validBody = {
      title: "Test",
      description: "Valid desc",
      status: "pending",
      due_datetime: "2024-12-31T10:00:00.000Z",
    };

    req.body = validBody;

    const parsedISO = new Date(validBody.due_datetime).toISOString();
    const constraintErr = new ConstraintError("duplicate");

    (model.insertTask as jest.Mock).mockRejectedValue(constraintErr);

    await createTask(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(constraintErr);
  });
});

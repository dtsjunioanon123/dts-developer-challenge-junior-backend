import "../../src/config/env"; // load env
import request from "supertest";
import app from "../../src/app"; // your Express app
import db from "../../src/db/dbConnection";
import seed from "../../src/db/mock/seed";
import { tasks } from "../../src/db/mock/data/test";

describe("Integration: Tasks API", () => {
  beforeEach(async () => {
    // Reset the DB to a known state
    await seed({ tasks });
  });

  afterAll(async () => {
    await db.end(); // close DB connection
  });

  // ------------------------------------------
  // CREATE TASK
  // ------------------------------------------
  describe("POST /tasks", () => {
    it("should create a task successfully", async () => {
      const newTask = {
        title: "Integration Test Task",
        description: "This is a full E2E test",
        status: "pending",
        due_datetime: "2025-01-01T12:00:00.000Z",
      };

      const res = await request(app)
        .post("/tasks")
        .send(newTask)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body.task).toMatchObject({
        id: expect.any(Number),
        ...newTask,
      });

      // Optional: verify DB directly
      const dbRes = await db.query("SELECT * FROM tasks WHERE id = $1", [
        res.body.task.id,
      ]);
      expect(dbRes.rows[0]).toMatchObject({
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
      });
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/tasks")
        .send({ description: "Missing title" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body.error).toBeDefined();
    });

    it("should return 409 for duplicate title (unique constraint)", async () => {
      // Insert a task manually
      const existingTask = {
        title: "Duplicate Task",
        description: "Already exists",
        status: "pending",
        due_datetime: "2025-01-01T12:00:00Z",
      };
      await db.query(
        "INSERT INTO tasks (title, description, status, due_datetime) VALUES ($1,$2,$3,$4)",
        [
          existingTask.title,
          existingTask.description,
          existingTask.status,
          existingTask.due_datetime,
        ]
      );

      const res = await request(app)
        .post("/tasks")
        .send(existingTask)
        .expect("Content-Type", /json/)
        .expect(409);

      expect(res.body.error).toContain("A task with this title already exists");
    });
  });
});

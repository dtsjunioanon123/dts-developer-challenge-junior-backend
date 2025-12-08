import db from "../dbConnection";
import * as schema from "./schema";

async function createNewTables() {

    await db.query(`DROP TABLE IF EXISTS tasks;`);
    await db.query(`DROP TYPE IF EXISTS task_status;`);

    await db.query(schema.taskStatusType);
    await db.query(schema.tasksTable);
}

export default createNewTables;

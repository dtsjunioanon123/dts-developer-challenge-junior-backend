import db from "../dbConnection";
import format from "pg-format";
import createTables from "./initialiseSchema";

const seed = async (data: Record<string, Record<string, string>[]>) => {
    await createTables();
    console.log("seeding...");

    for (const [relation, records] of Object.entries(data)) {
        if (!records || records.length === 0) continue;

        const columns = Object.keys(records[0]);
        const formattedValues = records.map((record) =>
            columns.map((col) => record[col])
        );

        await db.query(
            format(
                `INSERT INTO ${relation} (${columns.join(
                    ", "
                )}) VALUES %L RETURNING *`,
                formattedValues
            )
        );
    }

    console.log("seeding complete...");
};

export default seed;

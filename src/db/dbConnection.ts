import pg from "pg";

const { Pool } = pg;

if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
}

export default new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || "5432"),
});
import dotenv from "dotenv";
import path from "path";

const CURRENT_ENV = process.env.NODE_ENV || "dev";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), `.env.${CURRENT_ENV}`) });

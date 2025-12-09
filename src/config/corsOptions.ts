import cors from "cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(","); // react dev frontend;

export const corsOptions = cors({
    origin: allowedOrigins,
    credentials: true,
});

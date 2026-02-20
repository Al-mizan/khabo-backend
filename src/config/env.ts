import { config } from "dotenv";

config({ path: ".env" });

export const {
    DATABASE_URL,
    PORT,
    APP_URL,
    BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    PUBLIC_APP_URL,
    PUBLIC_BETTER_AUTH_URL,
} = process.env;
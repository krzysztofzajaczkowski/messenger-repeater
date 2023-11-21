import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, USER_ID, THREAD_ID, COOKIES_FILE_PATH } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !USER_ID || !THREAD_ID || !COOKIES_FILE_PATH) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  USER_ID,
  THREAD_ID,
  COOKIES_FILE_PATH
};
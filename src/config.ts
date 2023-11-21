import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, USER_ID, THREAD_ID, COOKIES_FILE_PATH, MESKA_SRODA_DISCORD_CHANNEL_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !USER_ID || !THREAD_ID || !COOKIES_FILE_PATH || !MESKA_SRODA_DISCORD_CHANNEL_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  USER_ID,
  THREAD_ID,
  COOKIES_FILE_PATH,
  MESKA_SRODA_DISCORD_CHANNEL_ID
};
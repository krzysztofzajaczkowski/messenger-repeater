import dotenv from "dotenv";
import fs from "fs";
import { AppConfig } from "./appConfig";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, USER_ID, THREAD_ID, COOKIES_FILE_PATH, MESKA_SRODA_DISCORD_CHANNEL_ID, WEBHOOK_TOKEN, CONFIG_FILE_PATH } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !USER_ID || !THREAD_ID || !COOKIES_FILE_PATH || !MESKA_SRODA_DISCORD_CHANNEL_ID || !WEBHOOK_TOKEN || !CONFIG_FILE_PATH) {
  throw new Error("Missing environment variables");
}

// Read data from config.json file
const configJsonPath = CONFIG_FILE_PATH;
let configData = {
  MEDIA_INTEGRATIONS: []
};

try {
  const configJsonContent = fs.readFileSync(configJsonPath, "utf-8");
  configData = JSON.parse(configJsonContent);
} catch (error) {
  console.error(`Error reading or parsing ${CONFIG_FILE_PATH} file:`, error);
}

export const config : AppConfig = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  USER_ID,
  THREAD_ID,
  COOKIES_FILE_PATH,
  MESKA_SRODA_DISCORD_CHANNEL_ID,
  WEBHOOK_TOKEN,
  ...configData
};
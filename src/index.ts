import Bot from "./bot";
import Mess from "./mess";

const messenger = new Mess();
const bot = new Bot(messenger);
bot.start();
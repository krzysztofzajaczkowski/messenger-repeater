import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import Mess from "./mess";

class Bot {
  client: Client;
  messenger: Mess;

  constructor(messenger: Mess) {
    this.client = new Client({
      intents: ["Guilds", "GuildMessages", "DirectMessages"],
    });
    
    this.messenger = messenger;
  }

  start() {
    this.client.once("ready", () => {
      console.log("Discord bot is ready! 🤖");
    });
  
    this.client.on("guildAvailable", async (guild) => {
      await deployCommands({ guildId: guild.id });
  });
  
  this.client.on("interactionCreate", async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

      const command = commands.find(c => c.data.name === interaction.commandName);
      if(command) {
        if(command.run) {
            command.run(this, interaction);
            return;
        }

        // IF COMMAND HAS NO RUN METHOD - WE HAVE TO DEAL WITH IT HERE
        // ...
    }
    });
  
  
    this.client.login(config.DISCORD_TOKEN);
  }
  
}

export default Bot;
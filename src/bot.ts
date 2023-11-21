import { Client, Events, GatewayIntentBits, GuildChannel, TextChannel } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import Mess from "./mess";

class Bot {
  client: Client;
  messenger: Mess;

  constructor(messenger: Mess) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
    });
    
    this.messenger = messenger;
    this.messenger.bot = this;
  }

  start() {
    this.client.once(Events.ClientReady, () => {
      console.log("Discord bot is ready! 🤖");
    });
  
    this.client.on(Events.GuildAvailable, async (guild) => {
      await deployCommands({ guildId: guild.id });
  });
  
  this.client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

      const command = commands.find(c => c.data.name === interaction.commandName);
      if(command) {
        if(command.run) {
            command.run(this, interaction);
            return;
        }
      }
    });

    this.client.on(Events.MessageCreate, async (message) => {
      if(message.channel.id === config.MESKA_SRODA_DISCORD_CHANNEL_ID && !message.author.bot) {
        this.messenger.sendMessage(`${message.member?.displayName}: ${message.content.toString()}`);
      }
    });
  
  
    this.client.login(config.DISCORD_TOKEN);
  }
  
  sendMeskaSrodaMessage(authorNickname: string, text: string, attachments: string[]) {
    const channel = this.client.channels.cache.get(config.MESKA_SRODA_DISCORD_CHANNEL_ID) as TextChannel;
    channel.send({content: `${authorNickname}: ${text}`, files: attachments});
  }
}



export default Bot;
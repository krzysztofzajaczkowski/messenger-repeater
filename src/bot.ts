import { Client, Events, GatewayIntentBits, GuildChannel, TextChannel } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config/config";
import Mess from "./mess";
import { MediaIntegrationFilter } from "./media-integrations/mediaIntegrationFilter";

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
      console.log(`[Pterodactyl] Service started`);
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
      if (!message.author.bot) {
        const mediaIntegrationFilter = config.MEDIA_INTEGRATION_FILTERS.find(f => f.matchesDiscordChannelId(message.channel.id));

        if (mediaIntegrationFilter) {
          console.log(`[INFO][Bot] Sending to ${mediaIntegrationFilter.name} Messenger chat`);
          this.messenger.sendMessage(`${message.member?.displayName}: ${message.content.toString()}`, mediaIntegrationFilter.messengerThreadId);  
        }
      }
    });
  
  
    this.client.login(config.DISCORD_TOKEN);
  }
  
  async sendMeskaSrodaMessage(mediaIntegrationFilter: MediaIntegrationFilter, authorNickname: string, text: string, attachments: string[], avatarUrl: string) {
    const channel = this.client.channels.cache.get(mediaIntegrationFilter.discordChannelId) as TextChannel;
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.find(wh => wh.token === mediaIntegrationFilter.discordWebhookToken);
    
    if(!webhook)
      return console.log('No webhook by config token');

    await webhook.send({
      content: text,
      username: authorNickname,
      files: attachments,
      avatarURL: avatarUrl
    });
  }
}



export default Bot;
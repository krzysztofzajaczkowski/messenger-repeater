import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ICommand } from "../types/ICommand";

export const messSendCommand : ICommand = {
    data: new SlashCommandBuilder()
        .setName("mess_send")
        .setDescription("Send text to messenger")
        .addStringOption(option => 
            option
                .setName("thread-id")
                .setDescription("Text")
            )
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Text")),
    run: async (bot, interaction) => {
        await interaction.deferReply();

        const threadId = interaction.options.getString('thread-id');
        const text = interaction.options.getString('text');
        if(text && threadId) {
            bot.messenger.sendMessage(text, threadId);
            interaction.editReply("Done");
        } else {
            interaction.editReply("Cos zjebales");
        }

    }
}
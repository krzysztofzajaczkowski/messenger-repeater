import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ICommand } from "../types/ICommand";

export const messSendCommand : ICommand = {
    data: new SlashCommandBuilder()
        .setName("mess_send")
        .setDescription("Send text to messenger")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Text")),
    run: async (bot, interaction) => {
        await interaction.deferReply();

        const text = interaction.options.getString('text');
        if(text) {
            bot.messenger.sendMessage(text);
            interaction.editReply("Done");
        } else {
            interaction.editReply("Cos zjebales");
        }

    }
}
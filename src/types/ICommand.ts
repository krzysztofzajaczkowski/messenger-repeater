import {
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
  } from "@discordjs/builders";
import Bot from "../bot";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";

export interface ICommand {
  data:
  | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
  | SlashCommandSubcommandsOnlyBuilder;
  run?: (bot : Bot, interaction: ChatInputCommandInteraction) => Promise<void>;
}
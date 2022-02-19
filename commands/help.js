const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help menu'),
    async execute(interaction) {
        await interaction.reply(`This bot will automatically record all of your wordle scores without any action needed. Use /leaderboard to see.`);
    },
};
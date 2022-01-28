const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help menu'),
    async execute(interaction) {
        await interaction.reply(`HELP`);
    },
};
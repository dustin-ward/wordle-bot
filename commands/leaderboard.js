const fs = require("fs");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('show the current state of the world leaderboard'),
    async execute(interaction) {
        var users = []
        fs.readFile('./data.json', (err, jsondata) => {
            if(err) throw err;

            let data = JSON.parse(jsondata);

            let curGuildId = interaction.guildId;
            users = data.users.filter(u => u.server == curGuildId);
        });

        const leaderboard = new MessageEmbed()
                .setColor("#538d4e")
                .setTitle("Local Leaderboard")
                .setThumbnail('attachment://logo.png')

        interaction.channel.send({embeds: [leaderboard], files: ['./static/logo.png']});
        await interaction.reply("Sent!");
    },
};
const fs = require("fs");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('show the current state of the world leaderboard'),
    async execute(interaction) {
        var users = []

        await fs.readFile('./data.json', (err, jsondata) => {
            if(err) throw err;

            let data = JSON.parse(jsondata);

            var leaderboard = new MessageEmbed()
                    .setColor("#538d4e")
                    .setTitle("Local Leaderboard")
                    .setThumbnail('attachment://logo.png')

            let curGuildId = interaction.guildId;
            users = data.users.filter(u => u.server === curGuildId);

            console.log(users.length, "users found");

            let userData = []
            users.forEach(u => {
                let days = u.score.reduce((partialSum, a) => partialSum + a, 0);
                let correct = days - u.score[0];

                let sum = 0
                for(let i=1; i<=6; i+=1) {
                    sum += i * (u.score[i]);
                }
                sum += 6 * u.score[0];

                let avgGuess = sum / days;
                userData.push({name: u.tag, correct: correct, days: days, avg: avgGuess.toFixed(2)});
            });

            userData.sort((a,b) => {
                if(a.avg < b.avg) {
                    return -1;
                }
                else if(a.avg > b.avg) {
                    return 1;
                }
                else {
                    if(a.correct < b.correct) {
                        return -1;
                    }
                    else if(a.correct > b.correct) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            });

            userData[0].name += " :crown:";
            userData.forEach(u => {
                leaderboard.addField(u.name, `Days completed: ${u.correct}/${u.days}\nAvg # of guesses: ${u.avg}`);
            });

            interaction.channel.send({embeds: [leaderboard], files: ['./static/logo.png']});
            interaction.reply("Sent!");
        });

        
    },
};
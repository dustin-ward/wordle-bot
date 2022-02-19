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
                    .setURL('https://github.com/dustin-ward/wordle-bot')
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

                let pts = 0;
                for(let i=0; i<6; i+=1) {
                    pts += u.score[i+1] * (6-i);
                }

                userData.push({name: u.tag, id: u.id, correct: correct, days: days, avg: avgGuess.toFixed(2), pts: pts});
            });

            userData.sort((a,b) => {
                if(a.pts < b.pts) {
                    return 1;
                }
                else if(a.pts > b.pts) {
                    return -1;
                }
                else {
                    if(a.avg < b.avg) {
                        return -1;
                    }
                    else if(a.avg > b.avg) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            });

            if(userData.length > 0) {
                userData[0].name += " :crown:";
            }
            if(userData.length > 1) {
                userData[1].name += " :second_place:";
            }
            if(userData.length > 2) {
                userData[2].name += " :third_place:";
            }
            userData.forEach(u => {
                // const member = interaction.guild.members.fetch(u.id);
                // var nickname = member.displayName;
                leaderboard.addField(u.name, `Days completed: ${u.correct}/${u.days}\nAvg # of guesses: ${u.avg}\nTotal Score: ${u.pts}`);
            });

            interaction.channel.send({embeds: [leaderboard], files: ['./static/logo.png']});
            interaction.reply("Sent!");
        });

        
    },
};
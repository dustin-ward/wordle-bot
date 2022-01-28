const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on("ready", () => {
    console.log(`WordleBot is running in ${client.guilds.cache.size} servers`);
    client.user.setPresence({ activity: { type: 'WATCHING', name: "for " + config.prefix + "help" }, status: 'online' });
});

client.on('interactionCreate', async interaction => {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async message => {
    let re = /Wordle \d+ ([1-6]|X)\/6/;
    let res = message.content.match(re);
    if(res != null) {
        let utag = message.author.tag;
        let uid = message.author.id;
        let score = res[1];
        if(score > 6 || score <= 0) {
            console.log(`Invalid score submitted by ${utag}(${uid}): ${score}/6`);
            return;
        }

        console.log(`Score submitted by user ${utag}(${uid}): ${score}/6`);
        
        fs.readFile('./data.json', (err, jsondata) => {
            if(err) throw err;

            let data = JSON.parse(jsondata);
            let u = data.users.find(u => u.id === uid);
            
            if(u === undefined) {
                data.users.push({
                    id: uid,
                    tag: utag,
                    server: message.guildId,
                    score: [0,0,0,0,0,0,0]
                });
                u = data.users.find(u => u.id === uid)
            }

            if(score == "X") {
                u.score[0] += 1;
            }
            else {
                u.score[score] += 1;
            }
            fs.writeFile('./data.json', JSON.stringify(data, null, 4), (err) => {if(err) throw err;});
        });
    }
});

client.login(config.token);
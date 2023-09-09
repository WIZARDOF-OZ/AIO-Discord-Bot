// Defining the values

require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder, Collection, Partials, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('node:path');

const myBot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildWebhooks,
    ],
    partials: [Partials.Channel],
});

const { token, prefix, emoji } = require('./config.js');

// Defining the global Collection
myBot.commands = new Collection();
myBot.cooldowns = new Collection();
myBot.normal_cmds = new Collection();

myBot.on('ready', () => {
    console.log(`Im Online YAYAY ${myBot.user.tag}`);
    myBot.user.setStatus('idle');
    myBot.user.setActivity('Under Developement', ActivityType.Watching);
});

// Slash Commands Code Starts

//slashcommands folder
const commandsKaRasta = path.join(__dirname, 'commands');
const commandKaMaal = fs.readdirSync(commandsKaRasta);

//sub folders of slash commands
for (const folder of commandKaMaal) {
    const sumFolders = path.join(commandsKaRasta, folder);
    const asliMaal = fs.readdirSync(sumFolders).filter(file => file.endsWith('.js'));
    for (const commands of asliMaal) {
        const filePath = path.join(sumFolders, commands);
        const command = require(filePath);
        //finally setting commands
        if ('data' in command && 'execute' in command) {
            myBot.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        myBot.once(event.name, (...args) => event.execute(...args));
    } else {
        myBot.on(event.name, (...args) => event.execute(...args));
    }
}



// Login starts
myBot.login(token);
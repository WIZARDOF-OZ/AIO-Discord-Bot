// Defining the values

require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder, Collection, Partials, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('node:path');

const aio = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
});

const { token } = require('./config.js');


// Defining the global Collection
aio.commands = new Collection();
aio.cooldowns = new Collection();
aio.prefix_cmds = new Collection();

// Handlers
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

// Load Handlers
commandHandler(aio);
eventHandler(aio);

aio.on('shardError', error => console.log(' [SHARD ERROR] ', error));
process.on('unhandledRejection', error => console.log(' [UNHANDLED REJECTION] ', error));
process.on('uncaughtException', error => console.log(' [UNCAUGHT EXCEPTION] ', error));

// Login starts
aio.login(token).catch(err => {
    console.log(err);
    process.exit(1);
});

module.exports = aio;

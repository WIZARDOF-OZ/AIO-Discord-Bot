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
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel, Partials.Message],
});

const { token, prefix, emoji, color, owners } = require('./config.js');
const config = require('./config.js');

// Defining the global Collection
aio.commands = new Collection();
aio.cooldowns = new Collection();
aio.prefix_cmds = new Collection();

/*============================= COMMAND HANNLER =============================*/
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
            aio.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

        }
    }
}

// prefix command handler
//regular commands

const prefix_cmds = path.join(__dirname, './prefix_cmds');
const prefix_cmds_folder = fs.readdirSync(prefix_cmds);

for (const sub_folder of prefix_cmds_folder) {

    const sub_folder_path = path.join(prefix_cmds, sub_folder);
    const main_files = fs.readdirSync(sub_folder_path).filter(fk => fk.endsWith('.js'));
    // console.log(`\`${main_files} \`commands loaded successfully`)
    for (const file_path of main_files) {
        const file = path.join(sub_folder_path, file_path);
        const command = require(file);
        aio.prefix_cmds.set(command.name, command);
        // console.log(`${file.split(reg_cmd)} loded commands`)
    }
}

/*============================= EVENT HANNLER =============================*/

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        aio.once(event.name, (...args) => event.execute(...args));
    } else {
        aio.on(event.name, (...args) => event.execute(...args));
    }
}


aio.snipes = new Collection()
aio.on(Events.MessageDelete, async (message) => {
    aio.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.size ? message.attachments?.first()?.proxyURL : null
    })
})
aio.on(Events.MessageUpdate, async (message) => {
    aio.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.size ? message.attachments?.first()?.proxyURL : null
    })
})
// For normal prefix command

// messageCreate event for regular commands
aio.on(Events.MessageCreate, (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const { content, author, member, guild, channel } = message;


    // if (author.bot) return;
    // if (!guild) return;
    // if (!content) return;

    const mentionRegex = new RegExp(`^<@!?${aio.user.id}> `);
    let prefix_mention = content.match(mentionRegex) ? content.match(mentionRegex)[0] : prefix;
    if (!content.toLowerCase().startsWith(prefix_mention)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const commandName = args.shift().toLowerCase();
    // aio.commands.set(pong.name, pong)
    // if (!aio.commands.has(commandName)) return;
    const command = aio.prefix_cmds.get(commandName) || aio.prefix_cmds.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return message.react('<:woot:1124216085407866911>');
    let instance = {
        owners: owners,
        color: color,
        emoji: emoji,
        commands: aio.commands,
        prefix: prefix,
    };

    // options for the command structure
    let options = {
        name: command.name,
        description: command.description || "No Description",
        usage: command.usage || "Not Specified",
        enabled: command.enabled === false ? false : true,
        aliases: command.aliases || [],
        category: command.category || "Other",
        memberPermissions: command.memberPermissions || [],
        ownerOnly: command.ownerOnly || false,
        cooldown: command.cooldown || 0,
        execute: command.execute,
        run: command.run,

    }

    if (command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }
    // Permissions for the commands
    let missingPermsMember = [];
    options.memberPermissions.forEach((perm) => {
        if (!member.permissions.has(perm)) {
            return missingPermsMember.push(perm);
        }
    });
    const noReqPermsMember = new EmbedBuilder()
        .setColor(color.error)
        .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${emoji.error} You require the following perms in order to use this command.\n${missingPermsMember.map(x => `**• ${x}**`).join("\n")}`)
    if (missingPermsMember.length > 0) return message.reply({ embeds: [noReqPermsMember] });

    // Cooldown or Slowmode
    const { cooldowns } = aio;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const cooldownEmbed = new EmbedBuilder()
                .setDescription(`${emoji.error} | please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                .setColor("Red")
            return message.reply({ embeds: [cooldownEmbed] });
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    // try {
    //     command.execute(message, args);
    // } catch (error) {
    //     message.reply('there was an error trying to execute that command!');
    // }

    // Embeds for the options
    const ownerOnlyCmd = new EmbedBuilder()
        .setColor(config.color.error)
        .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${config.emoji.error} Only the bot owner can use this command.`);
    if (options.ownerOnly && !config.owners.includes(author.id)) return message.reply({ embeds: [ownerOnlyCmd] });

    instance.currentCmd = options;
    instance.cmdName = commandName;
    try {

        if (command) {
            command.execute(aio, message, args, args.join(" "), instance);
            // command.run(message, args, args.join(" "), instance);
        }
    } catch (error) {
        console.log(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(config.color.error)
            .setTitle("An Unexpected Error Occured")
            .setDescription("```js\n" + error + "```")
        message.channel.send({ embeds: errorEmbed });
    }

});

aio.on(Events.ShardError, error => {
    console.error('A websocket connection encountered an error:', error);
});
process.on('unhandledRejection', error => {
    console.error('============================= Unhandled promise rejection =============================: \n', error);
});
aio.on('debug', console.log)
    .on('warn', console.log)

// exporting the file
module.exports = aio;

// Login starts
aio.login(token).catch(err => {
    console.log(err);
});

// deploying slash commands
const commands = [];
// Grabing all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}



const rest = new REST().setToken(process.env.token);

// and deployinggg
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }

})();
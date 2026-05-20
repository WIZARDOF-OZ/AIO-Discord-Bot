require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];

// Path to commands folder
const foldersPath = path.join(__dirname, '../commands');

console.log("Loading slash commands...\n");

const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

    const commandsPath = path.join(foldersPath, folder);

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'));

    console.log(`Checking folder: ${folder}`);

    for (const file of commandFiles) {

        const filePath = path.join(commandsPath, file);

        try {

            const command = require(filePath);

            if ('data' in command && 'execute' in command) {

                commands.push(command.data.toJSON());

                console.log(`✓ Loaded: ${command.data.name}`);

            } else {

                console.log(
                    `[WARNING] ${file} missing "data" or "execute"`
                );
            }

        } catch (err) {

            console.log(
                `[ERROR] Failed loading ${file}`
            );

            console.error(err);
        }
    }
}

const rest = new REST({ version: '10' })
    .setToken(process.env.TOKEN);

(async () => {

    try {

        console.log(
            `\nStarted refreshing ${commands.length} slash commands...\n`
        );

        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.client_id,
                process.env.guildID
            ),
            { body: commands }
        );

        console.log(
            `\n✓ Successfully reloaded ${data.length} slash commands`
        );

    } catch (error) {

        console.error(
            "\nFailed deploying slash commands:"
        );

        console.error(error);
    }

})();
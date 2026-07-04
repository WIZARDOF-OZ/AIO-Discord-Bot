const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { owners } = require('../../config.js');
const path = require('node:path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload a slash command without restarting (owner only)')
        .addStringOption(option => option
            .setName('command')
            .setDescription('The command to reload')
            .setRequired(true)),
    category: 'owner',

    async execute(interaction) {
        if (!owners.includes(interaction.user.id)) {
            return interaction.reply({
                content: '❌ This command is restricted to the bot owner only.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const commandName = interaction.options.getString('command').toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply({
                content: `❌ No command found with name \`${commandName}\`.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // find the file path
        const commandsPath = path.join(__dirname, '..');
        let filePath = null;

        for (const folder of fs.readdirSync(commandsPath)) {
            const folderPath = path.join(commandsPath, folder);
            if (!fs.statSync(folderPath).isDirectory()) {continue;}

            for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
                if (file === `${commandName}.js`) {
                    filePath = path.join(folderPath, file);
                    break;
                }
            }
        }

        if (!filePath) {
            return interaction.reply({
                content: `❌ Could not find the file for \`${commandName}\`.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // delete cache and re-require
        delete require.cache[require.resolve(filePath)];
        const newCommand = require(filePath);
        interaction.client.commands.set(newCommand.data.name, newCommand);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('🔄 Command Reloaded')
            .setDescription(`Successfully reloaded \`/${commandName}\``)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};
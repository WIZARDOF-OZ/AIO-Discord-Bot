const { SlashCommandBuilder, EmbedBuilder, ActivityType, MessageFlags } = require('discord.js');
const { owners } = require('../../config.js');

const activityTypes = {
    playing: ActivityType.Playing,
    watching: ActivityType.Watching,
    listening: ActivityType.Listening,
    competing: ActivityType.Competing,
};

const statusTypes = ['online', 'idle', 'dnd', 'invisible'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstatus')
        .setDescription('Change the bot status (owner only)')
        .addStringOption(option => option
            .setName('text')
            .setDescription('Status text')
            .setRequired(true))
        .addStringOption(option => option
            .setName('type')
            .setDescription('Activity type')
            .setRequired(false)
            .addChoices(
                { name: 'Playing', value: 'playing' },
                { name: 'Watching', value: 'watching' },
                { name: 'Listening', value: 'listening' },
                { name: 'Competing', value: 'competing' },
            ))
        .addStringOption(option => option
            .setName('status')
            .setDescription('Online status')
            .setRequired(false)
            .addChoices(
                { name: 'Online', value: 'online' },
                { name: 'Idle', value: 'idle' },
                { name: 'DND', value: 'dnd' },
                { name: 'Invisible', value: 'invisible' },
            )),
    category: 'owner',

    async execute(interaction) {
        if (!owners.includes(interaction.user.id)) {
            return interaction.reply({
                content: '❌ This command is restricted to the bot owner only.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const text = interaction.options.getString('text');
        const activityType = interaction.options.getString('type') ?? 'watching';
        const status = interaction.options.getString('status') ?? 'online';

        interaction.client.user.setPresence({
            status,
            activities: [{
                name: text,
                type: activityTypes[activityType],
            }],
        });

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Status Updated')
            .addFields(
                { name: '📝 Text', value: text, inline: true },
                { name: '🎮 Type', value: activityType, inline: true },
                { name: '🌐 Status', value: status, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};
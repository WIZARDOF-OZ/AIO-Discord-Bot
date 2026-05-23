const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, MessageFlags } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set the slowmode for a channel.')
        .addStringOption(option => option
            .setName('duration')
            .setDescription('Duration e.g. 10s, 5m, 1h or 0 to disable')
            .setRequired(true))
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to set slowmode in (defaults to current channel)')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for setting slowmode')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    category: 'mod',

    async execute(interaction) {
        const input = interaction.options.getString('duration');
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        //  Parse duration 
        let duration;

        if (input === '0') {
            duration = 0;
        } else {
            const parsed = ms(input);
            if (!parsed) {
                return interaction.reply({
                    content: '❌ Invalid duration format. Examples: `10s`, `5m`, `1h`, `0` to disable.',
                    ephemeral: true,
                });
            }
            duration = Math.floor(parsed / 1000);
        }

        //  Validation
        if (duration > 21600) {
            return interaction.reply({
                content: '❌ Maximum slowmode duration is 6 hours (`6h`).',
                ephemeral: true,
            });
        }

        if (channel.rateLimitPerUser === duration) {
            return interaction.reply({
                content: `❌ Slowmode is already set to **${input}** in ${channel}.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await channel.setRateLimitPerUser(duration, reason);

        const isDisabled = duration === 0;

        const embed = new EmbedBuilder()
            .setColor(isDisabled ? 'Green' : 'Orange')
            .setTitle(isDisabled ? '✅ Slowmode Disabled' : '🐢 Slowmode Enabled')
            .addFields(
                { name: '📢 Channel', value: `${channel}`, inline: true },
                { name: '⏱️ Duration', value: isDisabled ? 'Disabled' : `${input}`, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔧 Set By', value: interaction.user.username, inline: true },
            )
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
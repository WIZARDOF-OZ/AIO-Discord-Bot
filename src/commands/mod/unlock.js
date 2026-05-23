const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a channel to allow members to send messages.')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to unlock')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for unlocking')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    category: 'mod',

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        // check if already unlocked
        const everyonePerms = channel.permissionOverwrites.cache.get(interaction.guild.id);
        if (!everyonePerms?.deny.has(PermissionFlagsBits.SendMessages)) {
            return interaction.reply({ content: '❌ This channel is not locked.', ephemeral: true });
        }

        await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null });

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('🔓 Channel Unlocked')
            .addFields(
                { name: '📢 Channel', value: `${channel}`, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔓 Unlocked By', value: interaction.user.username, inline: true },
            )
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock a channel to prevent members from sending messages.')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to lock')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for locking')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    category: 'mod',

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        // check if already locked
        const everyonePerms = channel.permissionOverwrites.cache.get(interaction.guild.id);
        if (everyonePerms?.deny.has(PermissionFlagsBits.SendMessages)) {
            return interaction.reply({ content: '❌ This channel is already locked.', flags: MessageFlags.Ephemeral });
        }

        await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('🔒 Channel Locked')
            .addFields(
                { name: '📢 Channel', value: `${channel}`, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔒 Locked By', value: interaction.user.username, inline: true },
            )
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
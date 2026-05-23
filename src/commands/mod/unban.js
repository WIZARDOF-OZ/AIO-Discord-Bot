const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption(option => option
            .setName('userid')
            .setDescription('The ID of the user to unban')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for the unban')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const userId = interaction.options.getString('userid').trim();
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        // validate id is numeric
        if (!/^\d{17,20}$/.test(userId)) {
            return interaction.reply({
                content: '❌ Please provide a valid Discord user ID.',
                flags: MessageFlags.Ephemeral,
            });
        }

        // check if actually banned
        const ban = await interaction.guild.bans.fetch(userId).catch(() => null);

        if (!ban) {
            return interaction.reply({
                content: '❌ That user is not banned in this server.',
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.guild.bans.remove(userId, reason);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Member Unbanned')
            .addFields(
                { name: '👤 User', value: `${ban.user.username} (<@${ban.user.id}>)`, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔧 By', value: interaction.user.username, inline: true },
            )
            .setThumbnail(ban.user.displayAvatarURL())
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
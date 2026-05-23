const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Get detailed information about a role')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role to get info about')
            .setRequired(true))
        .setDMPermission(false),
    category: 'info',

    async execute(interaction) {
        const role = interaction.options.getRole('role');

        await interaction.deferReply();

        // members with this role
        await interaction.guild.members.fetch();
        const memberCount = interaction.guild.members.cache
            .filter(m => m.roles.cache.has(role.id)).size;

        // key permissions to display
        const keyPerms = [
            'Administrator',
            'ManageGuild',
            'ManageRoles',
            'ManageChannels',
            'ManageMessages',
            'ManageWebhooks',
            'ManageNicknames',
            'KickMembers',
            'BanMembers',
            'MentionEveryone',
            'ModerateMembers',
        ];

        const perms = keyPerms
            .filter(perm => role.permissions.has(perm))
            .map(perm => `\`${perm}\``)
            .join(', ') || 'None';

        // timestamps
        const createdAt = `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`;

        const embed = new EmbedBuilder()
            .setColor(role.hexColor ?? 'Random')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .addFields(
                { name: '🪪 Name', value: role.name, inline: true },
                { name: '🆔 Role ID', value: role.id, inline: true },
                { name: '🎨 Color', value: role.hexColor, inline: true },
                { name: '📅 Created At', value: createdAt, inline: false },
                { name: '👥 Members', value: `${memberCount}`, inline: true },
                { name: '📌 Position', value: `${role.position}`, inline: true },
                { name: '💬 Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
                { name: '📌 Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
                { name: '🤖 Managed', value: role.managed ? 'Yes' : 'No', inline: true },
                { name: '🔑 Key Permissions', value: perms, inline: false },
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
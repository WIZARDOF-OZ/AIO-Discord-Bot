const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const Warning = require('../../models/warning.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View warnings for a member')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to check warnings for')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const member = interaction.options.getMember('target');

        if (!member) {
            return interaction.reply({
                content: '❌ Could not find that member.',
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.deferReply();

        const userWarnings = await Warning.findOne({
            guildId: interaction.guild.id,
            userId: member.id,
        });

        if (!userWarnings || userWarnings.warnings.length === 0) {
            return interaction.editReply({
                content: `✅ **${member.user.username}** has no warnings in this server.`,
            });
        }

        const warningList = userWarnings.warnings.map((w, i) => {
            const date = `<t:${Math.floor(new Date(w.createdAt).getTime() / 1000)}:R>`;
            return `**${i + 1}.** <@${w.moderatorId}> — ${w.reason} (${date})`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`⚠️ Warnings for ${member.user.username}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(warningList)
            .addFields(
                { name: '⚠️ Total Warnings', value: `${userWarnings.warnings.length}`, inline: true },
                { name: '👤 User ID', value: member.id, inline: true },
            )
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const Warning = require('../../models/warning.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarnings')
        .setDescription('Clear warnings for a member')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to clear warnings for')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('index')
            .setDescription('Warning number to remove (leave empty to clear all)')
            .setMinValue(1)
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const index = interaction.options.getInteger('index');

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
                content: `✅ **${member.user.username}** has no warnings to clear.`,
            });
        }

        // remove specific warning by index
        if (index) {
            if (index > userWarnings.warnings.length) {
                return interaction.editReply({
                    content: `❌ Warning #${index} does not exist. **${member.user.username}** only has **${userWarnings.warnings.length}** warning(s).`,
                });
            }

            userWarnings.warnings.splice(index - 1, 1);
            await userWarnings.save();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('✅ Warning Removed')
                .addFields(
                    { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                    { name: '🗑️ Removed Warning', value: `#${index}`, inline: true },
                    { name: '⚠️ Remaining', value: `${userWarnings.warnings.length}`, inline: true },
                )
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        // clear all warnings
        await Warning.deleteOne({
            guildId: interaction.guild.id,
            userId: member.id,
        });

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ All Warnings Cleared')
            .addFields(
                { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                { name: '🔧 By', value: interaction.user.username, inline: true },
            )
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
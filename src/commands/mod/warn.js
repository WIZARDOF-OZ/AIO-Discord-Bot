const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const Warning = require('../../models/warning.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to warn')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for the warn')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        // validation
        if (!member) {
            return interaction.reply({
                content: '❌ Could not find that member.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ You cannot warn yourself.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (member.user.bot) {
            return interaction.reply({
                content: '❌ You cannot warn a bot.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return interaction.reply({
                content: '❌ You cannot warn someone with an equal or higher role than you.',
                flags: MessageFlags.Ephemeral,
            });
        }

        // add warning to db
        let userWarnings = await Warning.findOne({
            guildId: interaction.guild.id,
            userId: member.id,
        });

        if (!userWarnings) {
            userWarnings = new Warning({
                guildId: interaction.guild.id,
                userId: member.id,
                warnings: [],
            });
        }

        userWarnings.warnings.push({
            moderatorId: interaction.user.id,
            reason,
        });

        await userWarnings.save();

        const totalWarnings = userWarnings.warnings.length;

        // dm the warned user
        const dmEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`You have been warned in ${interaction.guild.name}`)
            .addFields(
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔧 By', value: interaction.user.username, inline: true },
                { name: '⚠️ Total Warnings', value: `${totalWarnings}`, inline: true },
            )
            .setTimestamp();

        await member.send({ embeds: [dmEmbed] }).catch(() => null);

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('⚠️ Member Warned')
            .addFields(
                { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔧 By', value: interaction.user.username, inline: true },
                { name: '⚠️ Total Warnings', value: `${totalWarnings}`, inline: true },
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to timeout')
            .setRequired(true))
        .addStringOption(option => option
            .setName('duration')
            .setDescription('Duration e.g. 10s, 5m, 1h, 1d (max 28d)')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for the timeout')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const input = interaction.options.getString('duration');
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
                content: '❌ You cannot timeout yourself.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (member.id === interaction.client.user.id) {
            return interaction.reply({
                content: '❌ I cannot timeout myself.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: '❌ I cannot timeout this member. They may have a higher role than me.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return interaction.reply({
                content: '❌ You cannot timeout someone with an equal or higher role than you.',
                flags: MessageFlags.Ephemeral,
            });
        }

        // parse duration
        const duration = ms(input);

        if (!duration) {
            return interaction.reply({
                content: '❌ Invalid duration format. Examples: `10s`, `5m`, `1h`, `1d`',
                flags: MessageFlags.Ephemeral,
            });
        }

        // discord max timeout is 28 days
        const maxDuration = 28 * 24 * 60 * 60 * 1000;
        if (duration > maxDuration) {
            return interaction.reply({
                content: '❌ Maximum timeout duration is 28 days.',
                flags: MessageFlags.Ephemeral,
            });
        }

        // dm before timeout
        const dmEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`You have been timed out in ${interaction.guild.name}`)
            .addFields(
                { name: '⏱️ Duration', value: input, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔧 By', value: interaction.user.username, inline: true },
            )
            .setTimestamp();

        await member.send({ embeds: [dmEmbed] }).catch(() => null);

        // apply timeout
        await member.timeout(duration, reason);

        const endsAt = `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('⏱️ Member Timed Out')
            .addFields(
                { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                { name: '⏱️ Duration', value: input, inline: true },
                { name: '⏰ Ends', value: endsAt, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔧 By', value: interaction.user.username, inline: true },
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
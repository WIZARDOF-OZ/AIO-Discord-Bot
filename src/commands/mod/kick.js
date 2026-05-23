const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to kick')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for the kick')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        //  Validation 
        if (!member) {
            return interaction.reply({
                content: '❌ Could not find that member. They may not be in this server.', flags: MessageFlags.Ephemeral
            });
        }

        if (member.id === interaction.user.id) {
                return interaction.reply({ content: "❌ You can't kick yourself.",  flags: MessageFlags.Ephemeral });
            }

            if (member.id === interaction.client.user.id) {
                return interaction.reply({ content: "❌ I can't kick myself.",  flags: MessageFlags.Ephemeral });
            }

            if (!member.kickable) {
                return interaction.reply({ content: '❌ I cannot kick this member. They may have a higher role than me.',  flags: MessageFlags.Ephemeral });
            }

            if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                return interaction.reply({ content: "❌ You can't kick someone with an equal or higher role than you.",  flags: MessageFlags.Ephemeral });
            }

            //  DM before kick ─
            const dmEmbed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle(`You have been kicked from ${interaction.guild.name}`)
                .addFields(
                    { name: '📋 Reason', value: reason, inline: true },
                    { name: '👢 Kicked By', value: interaction.user.username, inline: true },
                )
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] }).catch(() => null);


            await member.kick(reason);

            const successEmbed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('👢 Member Kicked')
                .addFields(
                    { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                    { name: '📋 Reason', value: reason, inline: true },
                    { name: '👢 Kicked By', value: interaction.user.username, inline: true },
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });
        },
    };
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { error } = require('../../config').emoji;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to ban')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for the ban')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        //  Validation 
        if (!member && !user) {
            return interaction.reply({ content: `${error} Could not find that user.`, flags: MessageFlags.Ephemeral });
        }

        // target not in guild — ban by user ID only
        if (!member) {
            await interaction.guild.bans.create(user.id, { reason });
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`✅ **${user.username}** was banned.\n📋 **Reason:** ${reason}`)
                        .setTimestamp()
                ],
            });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: `${error} You can't ban yourself.`, flags: MessageFlags.Ephemeral });
        }

        if (member.id === interaction.client.user.id) {
            return interaction.reply({ content: `${error} I can't ban myself.`, flags: MessageFlags.Ephemeral });
        }

        if (!member.bannable) {
            return interaction.reply({ content: `${error} I cannot ban this member. They may have a higher role than me.`, flags: MessageFlags.Ephemeral });
        }

        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return interaction.reply({ content: "❌ You can't ban someone with an equal or higher role than you.", flags: MessageFlags.Ephemeral });
        }

        //  DM before ban 
        const dmEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`You have been banned from ${interaction.guild.name}`)
            .addFields(
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔨 Banned By', value: interaction.user.username, inline: true },
            )
            .setTimestamp();

        await member.send({ embeds: [dmEmbed] }).catch(() => null); // ignore if DMs closed


        await member.ban({ reason });

        const successEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('🔨 Member Banned')
            .addFields(
                { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🔨 Banned By', value: interaction.user.username, inline: true },
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [successEmbed] });
    },
};
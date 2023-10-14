const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { owners } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Select a member to ban.')
        .addUserOption(option => option.setName('target').setDescription('who is being annoying?').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('and reason').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    category: 'mod',
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? "no reason provided"
        if (member.id === interaction.user.id) return interaction.reply(';-; you cant do that dude');
        // if (member.id !== owners.users) return interaction.reply(`You cant ban them`)
        const success = new EmbedBuilder()
            .setColor(0xf7aa52)
            .setDescription(`<:p_dot:837257989563744256> User: <@${member.id}> was ban from the server successfully\n\n <:p_dot:837257989563744256> Reason: \`\`${reason}\`\``);
        // .addFields(
        //     { name: "user", value: `<@${member.id}>`, inline: false },
        //     { name: "reason", value: reason, inline: false }
        // )

        const DMembed = new EmbedBuilder()
            .setColor(0xf7aa52)
            .setDescription(`<:p_dot:837257989563744256> you have been  ban from the ${interaction.guild.name} server\n\n <:p_dot:837257989563744256> Reason: \`\`${reason}\`\``);

        await interaction.guild.members.ban(member)
        if (member) {

            interaction.reply({ embeds: [success] })
        } else {
            interaction.reply(` An error Occured. The User might have DMs turned off, but they have been banned.`);
        }
        await member.send({ embeds: [DMembed] })

    },
};
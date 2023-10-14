const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, Guild, Interaction } = require('discord.js');
const { emoji } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Wanna me to unlock a channel?????')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Tell me the channel to unlock :)')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    category: 'mod',

    /**
     * @param {Guild} guild
     * @param {Interaction} interaction
     */

    async execute(interaction, guild) {



        const channel = interaction.options.getChannel('channel');

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true });

        const lockEmbed = new EmbedBuilder()
            .setColor(0xf7aa52)
            .setDescription(`${emoji.success} |  ${channel} has been unlocked `)
            .setTimestamp()
            .setFooter({ text: 'Command was used by a staff member', iconURL: interaction.guild.iconURL({ dynamic: true }) })
        // .setThumbnail(interaction.guild.iconURL({ dyanmic: true }))

        await interaction.reply({ embeds: [lockEmbed] })

    }
}

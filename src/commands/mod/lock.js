const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, Guild, Interaction } = require('discord.js');
const { emoji } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Wanna me to lock a channel?????')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Tell me the channel to lock :)')
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

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false });

        const lockEmbed = new EmbedBuilder()
            .setColor(0xf7aa52)
            .setDescription(`${emoji.success} |  ${channel} has been locked down`)
            .setTimestamp()
            .setFooter({ text: 'Command was used by a staff member', iconURL: interaction.guild.iconURL({ dynamic: true }) })
        // .setThumbnail(interaction.guild.iconURL({ dyanmic: true }))

        await interaction.reply({ embeds: [lockEmbed] })

    }
}

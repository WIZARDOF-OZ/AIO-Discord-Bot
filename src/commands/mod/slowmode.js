const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set a slowmode for a channel')
        .addIntegerOption(o => o.setName('duration').setDescription('The time for the slowmode').setRequired(true),
        )
        .addChannelOption(o => o.setName('channel').setDescription('the channel you want to set slowmode of').addChannelTypes(ChannelType.GuildText).setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    category: "mod",
    async execute(interaction) {
        const { options } = interaction;
        const duration = options.getInteger('duration');
        const channel = options.getChannel('channel') || interaction.channel;

        const slowembed = new EmbedBuilder()
            .setColor(0xfa9e48)
            .setDescription(`<:tick:846306021663703070> | ${channel} now has \`${duration}\` seconds of **slowmode**`);

        channel.setRateLimitPerUser(duration).catch(err => {
            return;
        });

        await interaction.reply({ embeds: [slowembed] });
    },
};
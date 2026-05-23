const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot latency'),
    category: 'utility',
    cooldown: 5,

    async execute(interaction) {
        await interaction.deferReply();

        const latency = Date.now() - interaction.createdTimestamp;
        const wsLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor('Green')
            .addFields(
                { name: '📡 Roundtrip Latency', value: `${latency}ms`, inline: true },
                { name: '💓 Websocket Latency', value: `${wsLatency}ms`, inline: true },
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
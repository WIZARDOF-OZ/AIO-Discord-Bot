const { SlashCommandBuilder, EmbedBuilder, Interaction } = require('discord.js');
/**
 * @param {Interaction} interaction
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    cooldown: 5,
    async execute(interaction) {
        const ping = Math.round(interaction.client.ws.ping);
        const pingEmbed = new EmbedBuilder()
            .setTitle('Ping of the bot')
            .setDescription(`🎾 | Bot Ping: ${ping}ms`)
            .setColor("Green")
            .setTimestamp()
            .setFooter({ text: `Command was used by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
        interaction.reply({ embeds: [pingEmbed] });




        // await interaction.reply("Pinging bot...").then(async (msg) => {
        //     const pingeEmbed = new EmbedBuilder()
        //         .setColor('Aqua')
        //         .setTitle('Pong! :ping_pong:')
        //         .addFields(
        //             { name: "Time Taken:", value: `${msg.createdTimestamp - msg.createdTimestamp}` },
        //             { name: "Uptime:", value: `${Math.round(interaction.uptime / 60000)}` },
        //             { name: 'Websocket:', value: `${interaction.ws.ping}` },
        //             { name: 'Rountrip Latency:', value: ` ${sent.createdTimestamp - interaction.createdTimestamp}ms` }
        //         )
        //     p / ''
        //         .setThumbnail("https://78.media.tumblr.com/be43242341a7be9d50bb2ff8965abf61/tumblr_o1ximcnp1I1qf84u9o1_500.gif")
        //     interaction.editReply({ embeds: [pingeEmbed] });
        // })
    },
};
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Shows the bot\'s latency.',
    guildOnly: false,
    category: 'fun',
    cooldown: 3,

    async execute(aio, message, args) {

        const ping = Math.round(aio.ws.ping);
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`Latency: ${ping}ms`)
            .setColor('Green')
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });
        message.reply({ embeds: [embed] })
    },

};

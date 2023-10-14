const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'firstmessage',
    aliases: ['fm', 'firstmsg'],
    description: "Find and sends the guild's first message of a particular channel",
    cooldown: 2,
    async execute(message, args) {
        const fetchMessages = await message.channel.messages.fetch({
            after: 1,
            limit: 1,
        });
        const msg = fetchMessages.first();
        const firstEmbed = new EmbedBuilder()
            .setTitle(`First Message in ${message.guild.name}`)
            .setURL(msg.url)
            .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Content: " + msg.content)
            .addFields({ name: "Author", value: msg.author, inline: true })
            .addFields({ name: "Message Id", value: msg.id, inline: true })
            .addFields({ name: 'Created At', value: message.createdAt.toLocaleDateString(), inline: true })
        message.channel.send({ embeds: [firstEmbed] })
    }
}
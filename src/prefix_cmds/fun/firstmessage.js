const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'firstmessage',
    aliases: ['fm', 'firstmsg'],
    description: "Find and sends the guild's first message of a particular channel",
    cooldown: 2,
    category: 'fun',
    guildOnly: true,
    async execute(aio, message, args) {
        const channel = message.mentions.channels.first() ?? message.channel;
        const fetchMessages = await channel.messages.fetch({
            after: 0,
            limit: 1,
        });
        const msg = fetchMessages.first();
        if (!msg) return message.reply("Couldn't find any messages in this channel.")
        const firstEmbed = new EmbedBuilder()
            .setTitle(`First Message in ${message.guild.name}`)
            .setURL(msg.url)
            .setDescription("Content: " + msg.content || "No content")
            .addFields({ name: "Author", value: `<@${msg.author.id}>`, inline: true })
            .addFields({ name: "Message Id", value: msg.id, inline: true })
            .addFields({ name: 'Created At', value: message.createdAt.toLocaleDateString(), inline: true })
        message.reply({ embeds: [firstEmbed] })
    }
}
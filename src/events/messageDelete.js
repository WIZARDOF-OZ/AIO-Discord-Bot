const { Events, AuditLogEvent, EmbedBuilder, Message, Channel } = require("discord.js");
module.exports = {
    name: Events.MessageDelete,
    /**
     * 
     * @param {Message} message 
     * @param {Channel} channel 
     */
    async execute(message, channel) {
        message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
        })
            .then(async audit => {
                const { executor } = audit.entries.first();
                const msg = message.content;
                if (!msg) return;

                const channelId = '860060454407766036';
                const modChannel = await message.guild.channels.cache.get(channelId);

                const modEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${message.guild.name} ModLog`, iconURL: message.guild.iconURL() })
                    .setColor("Red")
                    .setTitle("Message Deleted")
                    .addFields({ name: "Message Content", value: `${msg}` })
                    .addFields({ name: "Message Channel", value: `${msg.channel}` })
                    .addFields({ name: "Deleted By", value: `${executor.tag}` })
                    .setTimestamp()
                    .setThumbnail(message.guild.iconURL())
                    .setFooter({ text: "Message Delete Log", iconURL: message.guild.iconURL() })
                modChannel.send({ embeds: [modEmbed] });


            });
    },
};
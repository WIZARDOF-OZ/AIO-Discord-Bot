const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.MessageUpdate,
    async execute(message, newMessage) {
        message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageUpdate,
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
                    .setTitle("Message Update")
                    .addFields({ name: "Old Message", value: `${msg}` })
                    .addFields({ name: "New Message", value: `${newMessage}` })
                    .addFields({ name: "Edited By", value: `${executor.tag}` })
                    .setTimestamp()
                    .setThumbnail(message.guild.iconURL())
                    .setFooter({ text: "Message Edit Log", iconURL: message.guild.iconURL() })
                modChannel.send({ embeds: [modEmbed] });


            });
    },
};
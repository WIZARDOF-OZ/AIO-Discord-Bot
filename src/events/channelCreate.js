const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel, guild) {
        channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
        })
            .then(async audit => {
                const { executor } = audit.entries.first()
                const name = channel.name;
                const id = channel.id;
                let type = channel.type;

                if (type == 0) type = 'Text';
                if (type == 2) type = 'Voice';
                if (type == 13) type = 'Stage';
                if (type == 15) type = 'Form';
                if (type == 5) type = 'Announcement';
                if (type == 5) type = 'Category';

                const channelId = '860060454407766036';
                const modChannel = await channel.guild.channels.cache.get(channelId);

                const modEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${channel.guild.name} ModLog`, iconURL: channel.guild.iconURL() })
                    .setColor("Green")
                    .setTitle("Channel Created")
                    .addFields({ name: "Channel Name", value: `${name}, <#${id}>` })
                    .addFields({ name: "Channel Type", value: `${type}` })
                    .addFields({ name: "Channel Id", value: `${id}` })
                    .addFields({ name: "Created By", value: `${executor.tag}` })
                    .setTimestamp()
                    .setThumbnail(channel.guild.iconURL())
                    .setFooter({ text: "Channel Create Log", iconURL: channel.guild.iconURL() })
                modChannel.send({ embeds: [modEmbed] })


            })
    }
};
const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.GuildBanRemove,
    async execute(member) {
        member.guild.fetchAuditLogs({
            type: AuditLogEvent.GuildBanRemove,
        })
            .then(async audit => {
                const { executor } = audit.entries.first();
                const name = member.user.username;
                const id = member.user.id;

                const channelId = '860060454407766036';
                const modChannel = await member.guild.channels.cache.get(channelId);

                const modEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${member.guild.name} ModLog`, iconURL: member.guild.iconURL() })
                    .setColor("Green")
                    .setTitle("Member UnBanned")
                    .addFields({ name: "Member Name", value: `${name}, <@${id}>` })
                    .addFields({ name: "Member Id", value: `${id}` })
                    .addFields({ name: "UnBanned By", value: `${executor.tag}` })
                    .setTimestamp()
                    .setThumbnail(member.guild.iconURL())
                    .setFooter({ text: "UnBanned Log", iconURL: member.guild.iconURL() })
                modChannel.send({ embeds: [modEmbed] });


            });
    },
};
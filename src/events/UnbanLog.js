const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: Events.GuildBanRemove,

    async execute(aio, ban) {

        try {

            const guild = ban.guild;
            const user = ban.user;

            const channelId =
                "860060454407766036";

            const logChannel =
                guild.channels.cache.get(channelId);

            if (!logChannel) return;

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const fetchedLogs =
                await guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberBanRemove
                });

            const log =
                fetchedLogs.entries.first();

            const executor =
                log?.executor || {
                    tag: "Unknown"
                };

            const embed =
                new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({
                        name: `${guild.name} Mod Logs`,
                        iconURL:
                            guild.iconURL()
                    })
                    .setTitle("✅ Member Unbanned")
                    .addFields(
                        {
                            name: "User",
                            value:
                                `${user.tag}\n<@${user.id}>`,
                            inline: true
                        },
                        {
                            name: "User ID",
                            value: user.id,
                            inline: true
                        },
                        {
                            name: "Unbanned By",
                            value: executor.tag,
                            inline: true
                        }
                    )
                    .setThumbnail(
                        user.displayAvatarURL()
                    )
                    .setTimestamp();

            return logChannel.send({
                embeds: [embed]
            });

        } catch (err) {

            console.error(
                "[UnbanLog Error]",
                err
            );

        }
    }
};
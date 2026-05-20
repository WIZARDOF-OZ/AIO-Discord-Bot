const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: Events.GuildBanAdd,

    async execute(aio, ban) {

        try {

            const guild = ban.guild;
            const user = ban.user;

            // later move this to database/config
            const channelId = "860060454407766036";

            const logChannel =
                guild.channels.cache.get(channelId);

            if (!logChannel) return;

            // small delay so audit logs update
            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const fetchedLogs =
                await guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberBanAdd
                });

            const log =
                fetchedLogs.entries.first();

            const executor =
                log?.executor || {
                    tag: "Unknown"
                };

            const embed =
                new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({
                        name: `${guild.name} Mod Logs`,
                        iconURL:
                            guild.iconURL()
                    })
                    .setTitle("🔨 Member Banned")
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
                            name: "Banned By",
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
                "[BanLog Error]",
                err
            );

        }
    }
};
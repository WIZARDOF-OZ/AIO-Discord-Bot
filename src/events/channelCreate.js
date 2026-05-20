const {
    Events,
    AuditLogEvent,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

module.exports = {
    name: Events.ChannelCreate,

    async execute(channel) {

        try {

            const guild = channel.guild;

            if (!guild) {
                console.log(
                    "[ChannelCreate] Guild unavailable"
                );
                return;
            }

            const logChannelId =
                "860060454407766036";

            const logChannel =
                guild.channels.cache.get(
                    logChannelId
                );

            if (!logChannel) return;

            // wait briefly for audit logs
            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const logs =
                await guild.fetchAuditLogs({
                    type:
                        AuditLogEvent.ChannelCreate,
                    limit: 1
                });

            const entry =
                logs.entries.first();

            const executor =
                entry?.executor?.tag ||
                "Unknown";

            const types = {

                [ChannelType.GuildText]:
                    "Text",

                [ChannelType.GuildVoice]:
                    "Voice",

                [ChannelType.GuildStageVoice]:
                    "Stage",

                [ChannelType.GuildForum]:
                    "Forum",

                [ChannelType.GuildAnnouncement]:
                    "Announcement",

                [ChannelType.GuildCategory]:
                    "Category",

                [ChannelType.GuildNewsThread]:
                    "News Thread",

                [ChannelType.PublicThread]:
                    "Public Thread",

                [ChannelType.PrivateThread]:
                    "Private Thread"
            };

            const embed =
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(
                        "📁 Channel Created"
                    )
                    .addFields(
                        {
                            name: "Name",
                            value:
                                channel.name ||
                                "Unknown"
                        },
                        {
                            name: "Type",
                            value:
                                types[channel.type]
                                || "Unknown"
                        },
                        {
                            name: "Created By",
                            value:
                                executor
                        }
                    )
                    .setTimestamp();

            return logChannel.send({
                embeds: [embed]
            });

        } catch (err) {

            console.error(
                "[ChannelCreate]",
                err
            );

        }
    }
};
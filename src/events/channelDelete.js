const {
    Events,
    AuditLogEvent,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

module.exports = {
    name: Events.ChannelDelete,

    async execute(channel) {

        try {

            // deleted channels can be partial
            const guild = channel.guild;

            if (!guild) {
                console.log(
                    "[ChannelDelete] Guild unavailable"
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

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const logs =
                await guild.fetchAuditLogs({
                    type:
                        AuditLogEvent.ChannelDelete,
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
                    "Category"
            };

            const embed =
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(
                        "🗑️ Channel Deleted"
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
                            name: "Deleted By",
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
                "[ChannelDelete]",
                err
            );

        }

    }
};
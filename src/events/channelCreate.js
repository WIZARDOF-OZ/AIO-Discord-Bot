const {
    Events,
    AuditLogEvent,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

const audit =
    require("../utils/auditLog.js");

module.exports = {

    name:
        Events.ChannelCreate,

    async execute(channel) {

        try {

            if (!channel.guild)
                {return;}

            const guild =
                channel.guild;

            const logChannel =
                guild.channels.cache.get(
                    "860060454407766036"
                );

            if (!logChannel)
                {return;}

            const auditData =
                await audit.get(

                    guild,
                    AuditLogEvent.ChannelCreate

                );

            const executor =

                auditData.executor
                    ?.username ||

                "Unknown";

            const types = {

                [ChannelType.GuildText]:
                    "Text",

                [ChannelType.GuildVoice]:
                    "Voice",

                [ChannelType.GuildCategory]:
                    "Category",

                [ChannelType.GuildAnnouncement]:
                    "Announcement",

                [ChannelType.GuildForum]:
                    "Forum"

            };

            const embed =
                new EmbedBuilder()

                    .setColor(
                        "Green"
                    )

                    .setTitle(
                        "📁 Channel Created"
                    )

                    .addFields(

                        {
                            name: "Name",
                            value:
                                channel.name
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

            await logChannel.send({

                embeds: [embed]

            });

        }

        catch (err) {

            console.error(
                "[ChannelCreate]",
                err
            );

        }

    }

};
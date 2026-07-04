const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

const audit =
    require("../utils/auditLog");

module.exports = {

    name:
        Events.ChannelDelete,

    async execute(channel) {

        try {

            if (!channel.guild)
                {return;}

            const guild =
                channel.guild;

            const logChannelId =
                "860060454407766036";

            const logChannel =
                guild.channels.cache.get(
                    logChannelId
                );

            if (!logChannel)
                {return;}

            const auditData =
                await audit.get(

                    guild,
                    AuditLogEvent.ChannelDelete

                );

            const executor =

                auditData.executor
                    ?.username ||

                "Unknown";

            const embed =
                new EmbedBuilder()

                    .setColor(
                        "Red"
                    )

                    .setTitle(
                        "🗑️ Channel Deleted"
                    )

                    .addFields(

                        {

                            name: "Channel",

                            value:
                                channel.name

                        },

                        {

                            name: "Deleted By",

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
                "[ChannelDelete]",
                err
            );

        }

    }

};
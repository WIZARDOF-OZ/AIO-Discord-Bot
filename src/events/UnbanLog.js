const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

const audit =
    require("../utils/auditLog");

module.exports = {

    name:
        Events.GuildBanRemove,

    async execute(ban) {

        try {

            const guild =
                ban.guild;

            const user =
                ban.user;

            const logChannel =
                guild.channels.cache.get(
                    "860060454407766036"
                );

            if (!logChannel)
                {return;}

            const auditData =
                await audit.get(

                    guild,
                    AuditLogEvent.MemberBanRemove,
                    user.id

                );

            const executor =

                auditData.executor
                    ?.username ||

                "Unknown";

            const reason =
                auditData.reason;

            const embed =
                new EmbedBuilder()

                    .setColor(
                        "Green"
                    )

                    .setTitle(
                        "✅ Member Unbanned"
                    )

                    .addFields(

                        {
                            name: "User",
                            value:
                                `${user.username}`,
                            inline: true
                        },

                        {
                            name: "Unbanned By",
                            value:
                                executor,
                            inline: true
                        },

                        {
                            name: "Reason",
                            value:
                                reason
                        }

                    )

                    .setThumbnail(
                        user.displayAvatarURL()
                    )

                    .setTimestamp();

            await logChannel.send({

                embeds: [embed]

            });

        }

        catch (err) {

            console.error(
                "[UnbanLog]",
                err
            );

        }

    }

};
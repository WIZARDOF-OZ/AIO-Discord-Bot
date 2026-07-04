const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

const audit =
    require("../utils/auditLog.js");

module.exports = {

    name:
        Events.GuildBanAdd,

    async execute(ban) {

        try {

            const guild =
                ban.guild;

            const user =
                ban.user;

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
                    AuditLogEvent.MemberBanAdd,
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
                        "Red"
                    )

                    .setTitle(
                        "🔨 Member Banned"
                    )

                    .addFields(

                        {

                            name: "User",

                            value:
                                `${user.username}`,

                            inline: true

                        },

                        {

                            name: "Banned By",

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
                "[BanLog]",
                err
            );

        }

    }

};
const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

const audit =
    require("../utils/auditLog");

module.exports = {

    name:
        Events.GuildRoleDelete,

    async execute(role) {

        try {

            const guild =
                role.guild;

            const logChannel =
                guild.channels.cache.get(
                    "860060454407766036"
                );

            if (!logChannel)
                {return;}

            const auditData =
                await audit.get(

                    guild,
                    AuditLogEvent.RoleDelete

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
                        "🎭 Role Deleted"
                    )

                    .addFields(

                        {
                            name: "Role",
                            value:
                                role.name
                        },

                        {
                            name: "Deleted By",
                            value:
                                executor
                        }

                    );

            await logChannel.send({
                embeds: [embed]
            });

        }

        catch (err) {

            console.error(
                err
            );

        }

    }

};
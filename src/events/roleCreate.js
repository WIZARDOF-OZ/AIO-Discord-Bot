const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

const audit =
    require("../utils/auditLog");

module.exports = {

    name:
        Events.GuildRoleCreate,

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
                    AuditLogEvent.RoleCreate

                );

            const executor =
                auditData.executor
                    ?.username ||

                "Unknown";

            const embed =
                new EmbedBuilder()

                    .setColor(
                        "Green"
                    )

                    .setTitle(
                        "🎭 Role Created"
                    )

                    .addFields(

                        {
                            name: "Role",
                            value:
                                role.name
                        },

                        {
                            name: "Created By",
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
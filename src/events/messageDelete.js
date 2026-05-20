const {
    Events,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: Events.MessageDelete,

    async execute(message) {

        console.log(
            "[MessageDelete Event Fired]"
        );

        try {

            if (message.partial) {

                try {

                    await message.fetch();

                    console.log(
                        "[Fetched partial message]"
                    );

                } catch {

                    console.log(
                        "[Failed partial fetch]"
                    );

                    return;
                }
            }

            if (!message.guild) {

                console.log(
                    "[No guild]"
                );

                return;
            }

            const logChannelId =
                "860060454407766036";

            const logChannel =
                message.guild.channels.cache.get(
                    logChannelId
                );

            if (!logChannel) {

                console.log(
                    "[Log channel not found]"
                );

                return;
            }

            console.log(
                `[Found log channel: ${logChannel.name}]`
            );

            const embed =
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(
                        "🗑️ Message Deleted"
                    )
                    .setDescription(
                        `Author: ${message.author?.tag || "Unknown"}`
                    )
                    .addFields(
                        {
                            name: "Content",
                            value:
                                message.content ||
                                "No content"
                        }
                    )
                    .setTimestamp();

            await logChannel.send({
                embeds: [embed]
            });

            console.log(
                "[Embed sent]"
            );

        } catch (err) {

            console.error(
                "[MessageDelete ERROR]",
                err
            );

        }
    }
};
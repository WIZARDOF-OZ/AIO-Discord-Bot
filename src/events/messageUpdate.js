const {
    Events,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: Events.MessageUpdate,

    async execute(oldMessage, newMessage) {

        try {

            if (
                oldMessage.partial
            ) {

                await oldMessage.fetch();
            }

            if (
                newMessage.partial
            ) {

                await newMessage.fetch();
            }

            if (
                !oldMessage.guild ||
                oldMessage.author.bot
            ) {return;}

            if (
                oldMessage.content ===
                newMessage.content
            ) {return;}

            const channelId =
                "860060454407766036";

            const modChannel =
                oldMessage.guild.channels.cache.get(
                    channelId
                );

            if (!modChannel) {return;}

            const embed =
                new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle(
                        "✏️ Message Edited"
                    )
                    .addFields(
                        {
                            name: "User",
                            value:
                                oldMessage.author.username
                        },
                        {
                            name: "Old",
                            value:
                                oldMessage.content
                                    ?.slice(0, 1000)
                                || "None"
                        },
                        {
                            name: "New",
                            value:
                                newMessage.content
                                    ?.slice(0, 1000)
                                || "None"
                        }
                    )
                    .setTimestamp();

            return modChannel.send({
                embeds: [embed]
            });

        } catch (err) {

            console.error(
                "[MessageUpdate]",
                err
            );

        }

    }
};
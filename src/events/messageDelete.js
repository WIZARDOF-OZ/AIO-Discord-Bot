const {
    Events,
    EmbedBuilder
} = require("discord.js");
const logger = require("../utils/logger");
module.exports = {
    name: Events.MessageDelete,

    async execute(message) {

        logger.success("[MessageDelete Event Fired]");

        try {

            if (message.partial) {

                try {

                    await message.fetch();

                    logger.info("[Fetched partial message]");

                } catch {

                    logger.error("[Failed partial fetch]");

                    return;
                }
            }

            if (!message.guild) {

                logger.info("[No guild]");

                return;
            }

            const logChannelId =
                "860060454407766036";

            const logChannel =
                message.guild.channels.cache.get(
                    logChannelId
                );

            if (!logChannel) {

                logger.info("[Log channel not found]");

                return;
            }

            logger.info(`[Found log channel: ${logChannel.name}]`);

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

            logger.info("[Embed sent]");

        } catch (err) {

            logger.error("[MessageDelete ERROR]", err);

        }
    }
};
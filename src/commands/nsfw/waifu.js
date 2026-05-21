const {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("waifu")
        .setDescription(
            "Get a random anime image"
        ),

    async execute(interaction) {

        try {

            const response =
                await fetch(
                    "https://api.waifu.im/search?included_tags=waifu",
                    {
                        headers: {
                            "User-Agent":
                                "AIO-Discord-Bot/1.0"
                        }
                    }
                );

            if (!response.ok) {

                throw new Error(
                    `API Error: ${response.status}`
                );

            }

            const data =
                await response.json();

            const image =
                data.images?.[0];

            if (!image) {

                return interaction.reply({
                    content:
                        "No image found.",
                    flags:
                        MessageFlags.Ephemeral
                });

            }

            const embed =
                new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(
                        "🌸 Random Waifu"
                    )
                    .setImage(
                        image.url
                    );

            await interaction.reply({
                embeds: [embed]
            });

        }

        catch (err) {

            console.error(
                "[Waifu Command]",
                err
            );

            await interaction.reply({

                content:
                    `Failed: ${err.message}`,

                flags:
                    MessageFlags.Ephemeral

            });

        }

    }

};
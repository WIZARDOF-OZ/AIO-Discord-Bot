const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('milf')
        .setDescription('Sends milf pictures')
        .setNSFW(true),
    /**
        * 
        * @param {import("discord.js").Interaction} interaction 
        */
    async execute(interaction) {
        if (!interaction.channel.nsfw && interaction.channel.type === ChannelType.GuildText) { return interaction.reply({ content: "Sorry, this is a Not Safe For Work command! Channel is not set to age-restricted." }) }

        let amount = 1;
        let images = [
            "src/images/368.png",
            "src/images/7712.png",
            "src/images/7715.png",
        ];
        const image = images[Math.floor(Math.random() * images.length)];

        interaction.reply({
            content: ' ',
            files: [{ name: "milf.png", attachment: image }]
        }).catch(() => null);


    }
}
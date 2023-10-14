const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
    data: new SlashCommandBuilder()
        .setNSFW(true)
        .setName("waifu_pics")
        .setDescription("Pictures from waifu.pics")
        .addStringOption(option => option.setName("category").setDescription("NSFW category")
            .addChoices(
                { name: "waifu", value: "waifu" },
                { name: "neko", value: "neko" },
                { name: "trap", value: "trap" },
                { name: "blowjob", value: "blowjob" }
            )
            .setRequired(true))
        .addUserOption(option => option.setName('user_name').setDescription('User u want to mention').setRequired(false))
        .setDMPermission(true)
        .addNumberOption(option => option.setName("repeat").setDescription("Amount: If you want to get more then one at a time.").setMinValue(1).setMaxValue(10)),
    async execute(interaction) {
        if (!interaction.channel.nsfw && interaction.channel.type === ChannelType.GuildText) { return interaction.reply({ content: "Sorry, this is a Not Safe For Work command! Channel is not set to age-restricted." }) }
        let amount = 1;
        let user = interaction.options.getUser('user_name')
        const category = interaction.options.getString("category");
        if (interaction.options.getNumber("repeat")) { amount = Number(interaction.options.getNumber("repeat")) }
        for (let a = 0; a < amount; a++) {
            let response = await fetch(`https://api.waifu.pics/nsfw/${category}`);
            let data = await response.text();
            const img = JSON.parse(data);
            const embed = new EmbedBuilder()
                .setImage(img.url)
                .setFooter({ text: `${category} - ${a + 1}/${amount}` })
                .setColor([160, 32, 240]);
            try { await interaction.followUp({ content: `${user || ' '}`, embeds: [embed] }) }
            catch { interaction.reply({ content: `${user | ' '}`, embeds: [embed] }) }
            await wait(1000);
        }
    }
}
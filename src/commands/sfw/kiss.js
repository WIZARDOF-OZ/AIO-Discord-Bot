const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("kiss")
        .setDescription("Wanna Kiss Somebody?")
        .addUserOption(option => option.setName('user_name')
            .setDescription('User u want to mention')
            .setRequired(true)),
    async execute(interaction) {
        let amount = 1;
        let user = interaction.options.getUser('user_name')
        const category = "kiss";
        if (interaction.options.getNumber("repeat")) { amount = Number(interaction.options.getNumber("repeat")) }
        for (let a = 0; a < amount; a++) {
            let response = await fetch(`https://waifu.pics/api/sfw/${category}`);
            let data = await response.text();
            const img = JSON.parse(data);
            const embed = new EmbedBuilder()
                .setImage(img.url)
                .setFooter({ text: `${category} - ${a + 1}/${amount}` })
                .setColor([160, 32, 240]);
            try { await interaction.followUp({ content: `${interaction.user.tag} kissed ${user}`, embeds: [embed] }) }
            catch { interaction.reply({ content: `${interaction.user.tag} kissed ${user}`, embeds: [embed] }) }
            await wait(1000);
        }
    }
}
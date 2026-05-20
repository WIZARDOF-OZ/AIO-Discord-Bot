const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
    data: new SlashCommandBuilder()
        .setNSFW(false)
        .setName("kill")
        .setDescription("Whom do you wanna kill?")
        .addUserOption(option => option.setName('user_name')
            .setDescription('User u want to mention')
            .setRequired(true)),
    category: 'sfw',
    async execute(interaction) {
        let user = interaction.options.getUser('user_name')

        let response = await fetch(`https://waifu.pics/api/sfw/kill`);
        let data = await response.text();
        const img = JSON.parse(data);
        const embed = new EmbedBuilder()
            .setImage(img.url)
            .setFooter({ text: `kill` })
            .setColor([160, 32, 240]);
        try { await interaction.followUp({ content: `${interaction.user.tag} killed ${user}`, embeds: [embed] }) }
        catch { interaction.reply({ content: `${interaction.user.tag} killed ${user}`, embeds: [embed] }) }


    }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who do you want to hug?')
            .setRequired(true)),
    category: 'fun',

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        await interaction.deferReply();
        const response = await fetch('https://nekos.best/api/v2/hug');
        const data = await response.json();

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`🤗 **${interaction.user.username}** hugged **${user.username}**!`)
            .setImage(data.url)
            .setFooter({ text: 'waifu.pics', iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
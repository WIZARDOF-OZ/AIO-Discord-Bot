const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Kiss someone!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who do you want to kiss?')
            .setRequired(true)),
    category: 'fun',

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        await interaction.deferReply();
        const response = await fetch('https://nekos.best/api/v2/kiss');
        const data = await response.json();

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`💋 **${interaction.user.username}** kissed **${user.username}**!`)
            .setImage(data.url)
            .setFooter({ text: 'waifu.pics', iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
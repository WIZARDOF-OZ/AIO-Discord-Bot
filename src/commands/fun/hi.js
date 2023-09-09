const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hi')
        .setDescription('hello'),
    category: 'fun',
    async execute(interaction) {
        interaction.reply('Hoik');
    },

};
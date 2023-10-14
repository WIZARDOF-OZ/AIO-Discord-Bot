const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('What you want me say? ')
        .addStringOption(option => option.setName('words').setDescription('Gimme the words to say').setRequired(true)),
    category: 'fun',
    async execute(interaction) {
        const kay_bolu = interaction.options.getString('words');
        interaction.reply({ content: kay_bolu, ephemeral: false });
    },

};
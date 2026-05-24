const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random fun fact!'),
    category: 'fun',

    async execute(interaction) {
        await interaction.deferReply();

        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');

        if (!response.ok) {
            return interaction.editReply({
                content: '❌ Could not fetch a fact. Try again later.',
            });
        }

        const data = await response.json();

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('💡 Random Fact')
            .setDescription(data.text)
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
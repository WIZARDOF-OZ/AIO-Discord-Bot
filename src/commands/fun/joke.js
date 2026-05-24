const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Get a random joke!')
        .addStringOption(option => option
            .setName('category')
            .setDescription('Choose a joke category')
            .setRequired(false)
            .addChoices(
                { name: 'Any', value: 'Any' },
                { name: 'Pun', value: 'Pun' },
                { name: 'Dark', value: 'Dark' },
                { name: 'Programming', value: 'Programming' },
                { name: 'Misc', value: 'Misc' },
            )),
    category: 'fun',

    async execute(interaction) {
        const category = interaction.options.getString('category') ?? 'Any';

        await interaction.deferReply();

        const response = await fetch(`https://v2.jokeapi.dev/joke/${category}?blacklistFlags=racist,sexist`);

        if (!response.ok) {
            return interaction.editReply({
                content: '❌ Could not fetch a joke. Try again later.',
            });
        }

        const data = await response.json();

        // jokes are either single or two part
        const jokeText = data.type === 'twopart'
            ? `**Setup:** ${data.setup}\n\n**Punchline:** ||${data.delivery}||`
            : data.joke;

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`😂 ${category} Joke`)
            .setDescription(jokeText)
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
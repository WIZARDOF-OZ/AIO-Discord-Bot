const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke')
        .setDescription('Poke someone!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who do you want to poke?')
            .setRequired(true)),
    category: 'anime',

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        await interaction.deferReply();

        try {
            const response = await fetch('https://nekos.best/api/v2/poke');
            if (!response.ok) throw new Error(`API error ${response.status}`);
            const data = await response.json();

            const result = data.results[0]; // nekos.best returns { results: [...] }

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`👋 **${interaction.user.username}** patted **${user.username}**!`)
                .setImage(result.url)
                .setFooter({ text: 'nekos.best', iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error('[Pat] Fetch failed:', err.message);
            await interaction.editReply({ content: '❌ Failed to fetch image, try again later.' }); // editReply not reply
        }
    },
};
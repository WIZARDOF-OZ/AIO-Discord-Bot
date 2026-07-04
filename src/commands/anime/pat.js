const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Pat someone!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who do you want to pat?')
            .setRequired(true)),
    category: 'anime',

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        await interaction.deferReply();

        try {
            const response = await fetch('https://nekos.best/api/v2/pat');
            if (!response.ok) {throw new Error(`API error ${response.status}`);}
            const data = await response.json();

            const result = data.results[0];

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
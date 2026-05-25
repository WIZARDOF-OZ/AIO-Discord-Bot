const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wave')
        .setDescription('Wave at someone!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who do you want to wave at?')
            .setRequired(true)),
    category: 'anime',

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        await interaction.deferReply();
        try {
            const response = await fetch('https://nekos.best/api/v2/wave');
            if (!response.ok) throw new Error(`API error ${response.status}`);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`👋 **${interaction.user.username}** waved at **${user.username}**!`)
                .setImage(data.url)
                .setFooter({ text: 'waifu.pics', iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[Wave] Fetch failed:', err.message);
            await interaction.reply({ content: '❌ Failed to fetch image, try again later.', flags: MessageFlags.Ephemeral });
        }
    },
};
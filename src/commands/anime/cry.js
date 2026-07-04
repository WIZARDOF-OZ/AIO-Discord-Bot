const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cry')
        .setDescription('Cry...'),
    category: 'anime',

    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await fetch('https://nekos.best/api/v2/cry');
            if (!response.ok) {throw new Error(`API error ${response.status}`);}
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setDescription(`😭 **${interaction.user.username}** is crying...`)
                .setImage(data.url)
                .setFooter({ text: 'waifu.pics', iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[Cry] Fetch failed:', err.message);
            await interaction.reply({ content: '❌ Failed to fetch image, try again later.', flags: MessageFlags.Ephemeral });
        }
    },
};
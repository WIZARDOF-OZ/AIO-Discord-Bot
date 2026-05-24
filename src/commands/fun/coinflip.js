const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin!')
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('How many times to flip (max 10)')
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(false)),
    category: 'fun',

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount') ?? 1;
        const results = [];
        let heads = 0;
        let tails = 0;

        for (let i = 0; i < amount; i++) {
            const flip = Math.random() < 0.5 ? 'Heads' : 'Tails';
            results.push(flip === 'Heads' ? '🪙 Heads' : '🔵 Tails');
            flip === 'Heads' ? heads++ : tails++;
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('🪙 Coin Flip')
            .setDescription(results.join('\n'))
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        if (amount > 1) {
            embed.addFields(
                { name: '🪙 Heads', value: `${heads}`, inline: true },
                { name: '🔵 Tails', value: `${tails}`, inline: true },
            );
        }

        await interaction.reply({ embeds: [embed] });
    },
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice!')
        .addIntegerOption(option => option
            .setName('sides')
            .setDescription('Number of sides on the dice (default 6)')
            .setMinValue(2)
            .setMaxValue(1000)
            .setRequired(false))
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('Number of dice to roll (max 10)')
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(false)),
    category: 'fun',

    async execute(interaction) {
        const sides = interaction.options.getInteger('sides') ?? 6;
        const amount = interaction.options.getInteger('amount') ?? 1;

        const results = [];
        let total = 0;

        for (let i = 0; i < amount; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            results.push(`🎲 Dice ${i + 1}: **${roll}**`);
            total += roll;
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`🎲 Dice Roll — d${sides}`)
            .setDescription(results.join('\n'))
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        if (amount > 1) {
            embed.addFields(
                { name: '🔢 Total', value: `${total}`, inline: true },
                { name: '📊 Avg', value: `${(total / amount).toFixed(1)}`, inline: true },
            );
        }

        await interaction.reply({ embeds: [embed] });
    },
};
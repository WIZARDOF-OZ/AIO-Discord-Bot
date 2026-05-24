const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { owners } = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate JavaScript code (owner only)')
        .addStringOption(option => option
            .setName('code')
            .setDescription('Code to evaluate')
            .setRequired(true)),
    category: 'owner',

    async execute(interaction) {
        // owner only
        if (!owners.includes(interaction.user.id)) {
            return interaction.reply({
                content: '❌ This command is restricted to the bot owner only.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const code = interaction.options.getString('code');

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            let result = eval(code);

            // handle promises
            if (result instanceof Promise) result = await result;

            // convert to string
            let output = typeof result === 'object'
                ? JSON.stringify(result, null, 2)
                : String(result);

            // hide token from output just in case
            output = output.replaceAll(process.env.TOKEN, '[TOKEN REDACTED]');

            // truncate if too long
            if (output.length > 1900) output = output.slice(0, 1900) + '...';

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('✅ Eval Success')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
                    { name: '📤 Output', value: `\`\`\`js\n${output}\`\`\`` },
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ Eval Error')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
                    { name: '❌ Error', value: `\`\`\`js\n${err.message}\`\`\`` },
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    },
};
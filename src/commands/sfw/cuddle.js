// const { SlashCommandBuilder, EmbedBuilder, MessageFlags, } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('cuddle')
//         .setDescription('Cuddle someone!')
//         .addUserOption(option => option
//             .setName('user')
//             .setDescription('Who do you want to cuddle?')
//             .setRequired(true)),
//     category: 'fun',

//     async execute(interaction) {
//         const user = interaction.options.getUser('user');

//         let data;
//         try {
//             const response = await fetch('https://api.waifu.pics/sfw/cuddle');
//             if (!response.ok) throw new Error(`API error ${response.status}`);
//             data = await response.json();
//         } catch (err) {
//             console.error('[Cuddle] Fetch failed:', err.message);
//             return interaction.reply({
//                 content: '❌ Failed to fetch image, try again later.',
//                 flags: MessageFlags.Ephemeral,
//             });
//         }

//         const embed = new EmbedBuilder()
//             .setColor('Random')
//             .setDescription(`🤗 **${interaction.user.username}** cuddled **${user.username}**!`)
//             .setImage(data.url)
//             .setFooter({ text: 'waifu.pics', iconURL: interaction.user.displayAvatarURL() })
//             .setTimestamp();

//         await interaction.reply({ embeds: [embed] });
//     },
// };
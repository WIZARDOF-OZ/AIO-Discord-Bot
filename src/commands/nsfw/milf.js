// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('milf')
//         .setDescription('Sends a random milf image')
//         .setNSFW(true)
//         .setDMPermission(false),
//     category: 'nsfw',

//     async execute(interaction) {
//         await interaction.deferReply();

//         const response = await fetch('https://nekos.fun/api/milf');

//         if (!response.ok) {
//             return interaction.editReply({ content: `❌ API error ${response.status}, try again later.` });
//         }

//         const data = await response.json();

//         const embed = new EmbedBuilder()
//             .setColor('Random')
//             .setTitle('🔞 Milf')
//             .setImage(data.image)
//             .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
//             .setTimestamp();

//         await interaction.editReply({ embeds: [embed] });
//     },
// };
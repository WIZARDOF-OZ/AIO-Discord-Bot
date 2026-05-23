// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('kill')
//         .setDescription('Kill someone... virtually')
//         .addUserOption(option => option
//             .setName('user')
//             .setDescription('Who do you want to kill?')
//             .setRequired(true)),
//     category: 'fun',

//     async execute(interaction) {
//         const user = interaction.options.getUser('user');

//         const response = await fetch('https://api.waifu.pics/sfw/kiss');
//         const data = await response.json();

//         const embed = new EmbedBuilder()
//             .setColor('DarkRed')
//             .setDescription(`💀 **${interaction.user.username}** killed **${user.username}**!`)
//             .setImage(data.url)
//             .setFooter({ text: 'waifu.pics', iconURL: interaction.user.displayAvatarURL() })
//             .setTimestamp();

//         await interaction.reply({ embeds: [embed] });
//     },
// };
// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('waifu')
//         .setDescription('Get a random waifu image')
//         .addBooleanOption(option => option
//             .setName('nsfw')
//             .setDescription('Get NSFW content (only works in age-restricted channels)')
//             .setRequired(false))
//         .setDMPermission(false),
//     category: 'fun',

//     async execute(interaction) {
//         const isNsfw = interaction.options.getBoolean('nsfw') ?? false;

//         if (isNsfw && !interaction.channel.nsfw) {
//             return interaction.reply({
//                 content: '❌ NSFW content can only be used in age-restricted channels.',
//                 ephemeral: true,
//             });
//         }

//         await interaction.deferReply();

//         const type = isNsfw ? 'nsfw' : 'sfw';
//         const response = await fetch(`https://api.waifu.pics/${type}/waifu`);

//         if (!response.ok) {
//             return interaction.editReply({ content: `❌ API error ${response.status}, try again later.` });
//         }

//         const data = await response.json();

//         const embed = new EmbedBuilder()
//             .setColor('Random')
//             .setTitle(isNsfw ? '🔞 NSFW Waifu' : '🌸 Random Waifu')
//             .setImage(data.url)
//             .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
//             .setTimestamp();

//         await interaction.editReply({ embeds: [embed] });
//     },
// };
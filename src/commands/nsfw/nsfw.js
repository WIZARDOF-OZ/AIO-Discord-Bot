// const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
// const akaneko = require('akaneko');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('akaneko')
//         .setDescription('Get random akaneko NSFW content')
//         .setNSFW(true)
//         .addStringOption(option => option
//             .setName('type')
//             .setDescription('Choose a category')
//             .setRequired(true)
//             .addChoices(
//                 { name: 'Ass', value: 'ass' },
//                 { name: 'BDSM', value: 'bdsm' },
//                 { name: 'Gifs', value: 'gifs' },
//                 { name: 'Glasses', value: 'glasses' },
//                 { name: 'Hentai', value: 'hentai' },
//                 { name: 'Maid', value: 'maid' },
//                 { name: 'Masturbation', value: 'masturbation' },
//                 { name: 'Pussy', value: 'pussy' },
//                 { name: 'School', value: 'school' },
//                 { name: 'Thighs', value: 'thighs' },
//                 { name: 'Uniform', value: 'uniform' },
//             )),
//     category: 'nsfw',

//     async execute(interaction) {
//         const type = interaction.options.getString('type');

//         await interaction.deferReply();

//         //  Category => akaneko method map
//         const categoryMap = {
//             ass: () => akaneko.nsfw.ass(),
//             bdsm: () => akaneko.nsfw.bdsm(),
//             gifs: () => akaneko.nsfw.gifs(),
//             glasses: () => akaneko.nsfw.glasses(),
//             hentai: () => akaneko.nsfw.hentai(),
//             maid: () => akaneko.nsfw.maid(),
//             masturbation: () => akaneko.nsfw.masturbation(),
//             pussy: () => akaneko.nsfw.pussy(),
//             school: () => akaneko.nsfw.school(),
//             thighs: () => akaneko.nsfw.thighs(),
//             uniform: () => akaneko.nsfw.uniform(),
//         };

//         const fetchImage = categoryMap[type];

//         if (!fetchImage) {
//             return interaction.editReply({
//                 content: `❌ Unknown category \`${type}\`.`,
//             });
//         }

//         const imageUrl = await fetchImage();

//         if (!imageUrl) {
//             return interaction.editReply({
//                 content: '❌ Could not fetch an image, try again later.',
//             });
//         }

//         const embed = new EmbedBuilder()
//             .setColor('Random')
//             .setTitle(`🔞 ${type.charAt(0).toUpperCase() + type.slice(1)}`)
//             .setImage(imageUrl)
//             .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
//             .setTimestamp();

//         await interaction.editReply({ embeds: [embed] });
//     },
// };
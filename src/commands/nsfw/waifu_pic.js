// const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('waifu_pics')
//         .setDescription('Get images from waifu.pics')
//         .setNSFW(true)
//         .addStringOption(option => option
//             .setName('category')
//             .setDescription('Choose a category')
//             .setRequired(true)
//             .addChoices(
//                 { name: 'Waifu (NSFW)', value: 'nsfw/waifu' },
//                 { name: 'Neko (NSFW)', value: 'nsfw/neko' },
//                 { name: 'Trap (NSFW)', value: 'nsfw/trap' },
//                 { name: 'Blowjob (NSFW)', value: 'nsfw/blowjob' },
//             ))
//         .addUserOption(option => option
//             .setName('user')
//             .setDescription('User you want to mention')
//             .setRequired(false))
//         .addIntegerOption(option => option
//             .setName('amount')
//             .setDescription('How many images (1-5)')
//             .setMinValue(1)
//             .setMaxValue(5)
//             .setRequired(false))
//         .setDMPermission(false),
//     category: 'nsfw',

//     async execute(interaction) {
//         const category = interaction.options.getString('category');
//         const user = interaction.options.getUser('user');
//         const amount = interaction.options.getInteger('amount') ?? 1;

//         await interaction.deferReply();

//         for (let i = 0; i < amount; i++) {
//             const response = await fetch(`https://api.waifu.pics/${category}`);

//             if (!response.ok) {
//                 await interaction.followUp({
//                     content: `❌ API error ${response.status} on image ${i + 1}.`,
//                     flags: MessageFlags.Ephemeral,
//                 });
//                 continue;
//             }

//             const data = await response.json();
//             const embed = new EmbedBuilder()
//                 .setColor('Random')
//                 .setTitle(`${category.split('/')[1]} ${i + 1}/${amount}`)
//                 .setImage(data.url)
//                 .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
//                 .setTimestamp();

//             const content = user ? `<@${user.id}>` : undefined;

//             if (i === 0) {
//                 await interaction.editReply({ content, embeds: [embed] });
//             } else {
//                 await interaction.followUp({ content, embeds: [embed] });
//             }
//         }
//     },
// };
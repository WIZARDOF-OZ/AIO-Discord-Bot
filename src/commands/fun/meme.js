const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

const subreddits = [
    'memes',
    'dankmemes',
    'me_irl',
    'AdviceAnimals',
    'terriblefacebookmemes',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme!')
        .addStringOption(option => option
            .setName('category')
            .setDescription('Choose a meme category')
            .setRequired(false)
            .addChoices(
                { name: 'Memes', value: 'memes' },
                { name: 'Dank Memes', value: 'dankmemes' },
                { name: 'Me IRL', value: 'me_irl' },
                { name: 'Advice Animals', value: 'AdviceAnimals' },
                { name: 'Terrible FB', value: 'terriblefacebookmemes' },
            )),
    category: 'fun',

    async execute(interaction) {
        const category = interaction.options.getString('category')
            ?? subreddits[Math.floor(Math.random() * subreddits.length)];

        await interaction.deferReply();

        const response = await fetch(`https://www.reddit.com/r/${category}/random.json?limit=1`, {
            headers: { 'User-Agent': 'AIO-Discord-Bot/1.0' },
        });

        if (!response.ok) {
            return interaction.editReply({
                content: `❌ Failed to fetch meme. Try again later.`,
            });
        }

        const data = await response.json();
        const post = data?.[0]?.data?.children?.[0]?.data;

        if (!post || post.over_18 && !interaction.channel.nsfw) {
            return interaction.editReply({
                content: '❌ Could not fetch a meme or the result was NSFW. Try again!',
            });
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(post.title)
            .setURL(`https://reddit.com${post.permalink}`)
            .setImage(post.url)
            .addFields(
                { name: '👍 Upvotes', value: `${post.ups.toLocaleString()}`, inline: true },
                { name: '💬 Comments', value: `${post.num_comments.toLocaleString()}`, inline: true },
                { name: '📢 Subreddit', value: `r/${post.subreddit}`, inline: true },
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
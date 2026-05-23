const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get detailed information about the server')
        .setDMPermission(false),
    category: 'info',

    async execute(interaction) {
        const { guild } = interaction;

        await interaction.deferReply();

        // fetch full guild for accurate data
        const fetchedGuild = await guild.fetch();

        // owner
        const owner = await guild.fetchOwner();

        // channels
        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categories = guild.channels.cache.filter(c => c.type === 4).size;

        // members
        const totalMembers = guild.memberCount;
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        const humanCount = totalMembers - botCount;

        // roles
        const roles = guild.roles.cache
            .filter(r => r.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => `<@&${r.id}>`)
            .join(', ') || 'None';

        // boost info
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount ?? 0;

        // timestamps
        const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`;

        // verification level map
        const verificationMap = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Very High',
        };

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setThumbnail(guild.iconURL({ size: 256 }))
            .addFields(
                { name: '🪪 Server Name', value: guild.name, inline: true },
                { name: '🆔 Server ID', value: guild.id, inline: true },
                { name: '👑 Owner', value: `${owner.user.username}`, inline: true },
                { name: '📅 Created At', value: createdAt, inline: false },
                { name: '👥 Members', value: `Total: ${totalMembers}\n👤 Humans: ${humanCount}\n🤖 Bots: ${botCount}`, inline: true },
                { name: '📢 Channels', value: `💬 Text: ${textChannels}\n🔊 Voice: ${voiceChannels}\n📁 Categories: ${categories}`, inline: true },
                { name: '💎 Boosts', value: `Level: ${boostLevel}\nCount: ${boostCount}`, inline: true },
                { name: '🔒 Verification Level', value: verificationMap[guild.verificationLevel], inline: true },
                { name: '🎭 Role Count', value: `${guild.roles.cache.size - 1}`, inline: true },
                { name: '😀 Emoji Count', value: `${guild.emojis.cache.size}`, inline: true },
                { name: `🎨 Roles [${guild.roles.cache.size - 1}]`, value: roles.length > 1024 ? roles.slice(0, 1021) + '...' : roles, inline: false },
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // add banner if server has one
        if (fetchedGuild.banner) {
            embed.setImage(fetchedGuild.bannerURL({ size: 1024 }));
        }

        await interaction.editReply({ embeds: [embed] });
    },
};
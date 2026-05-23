const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get detailed information about a user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to get info about')
            .setRequired(false))
        .setDMPermission(false),
    category: 'info',

    async execute(interaction) {
        const member = interaction.options.getMember('user') ?? interaction.member;
        const user = member.user;

        await interaction.deferReply();

        // fetch full user for banner info
        const fetchedUser = await user.fetch();

        // Roles
        const roles = member.roles.cache
            .filter(r => r.id !== interaction.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => `<@&${r.id}>`)
            .join(', ') || 'None';

        //  Badges 
        const flagsMap = {
            Staff: '👮 Discord Staff',
            Partner: '🤝 Partnered Server Owner',
            Hypesquad: '🏠 HypeSquad Events',
            BugHunterLevel1: '🐛 Bug Hunter Level 1',
            BugHunterLevel2: '🐛 Bug Hunter Level 2',
            HypeSquadOnlineHouse1: '🏠 HypeSquad Bravery',
            HypeSquadOnlineHouse2: '🏠 HypeSquad Brilliance',
            HypeSquadOnlineHouse3: '🏠 HypeSquad Balance',
            PremiumEarlySupporter: '💎 Early Supporter',
            VerifiedDeveloper: '🤖 Verified Bot Developer',
            ActiveDeveloper: '👨‍💻 Active Developer',
            CertifiedModerator: '✅ Certified Moderator',
        };

        const badges = fetchedUser.flags?.toArray()
            .map(flag => flagsMap[flag])
            .filter(Boolean)
            .join('\n') || 'None';

        //Status 
        const statusMap = {
            online: '🟢 Online',
            idle: '🟡 Idle',
            dnd: '🔴 Do Not Disturb',
            offline: '⚫ Offline',
        };

        const status = statusMap[member.presence?.status ?? 'offline'];

        // ── Timestamps ───────────────────────────────────────────────────────
        const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`;
        const joinedAt = `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`;

        //  Boost 
        const boostingSince = member.premiumSinceTimestamp
            ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:F>`
            : 'Not boosting';

        const embed = new EmbedBuilder()
            .setColor(member.roles.highest.hexColor ?? 'Random')
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .addFields(
                { name: '🪪 Username', value: user.username, inline: true },
                { name: '🆔 User ID', value: user.id, inline: true },
                { name: '🤖 Bot', value: user.bot ? 'Yes' : 'No', inline: true },
                { name: '📅 Account Created', value: createdAt, inline: false },
                { name: '📥 Joined Server', value: joinedAt, inline: false },
                { name: '💎 Boosting Since', value: boostingSince, inline: false },
                { name: '🎭 Top Role', value: `${member.roles.highest}`, inline: true },
                { name: '🌐 Status', value: status, inline: true },
                { name: '🏅 Badges', value: badges, inline: false },
                { name: `🎨 Roles [${member.roles.cache.size - 1}]`, value: roles.length > 1024 ? roles.slice(0, 1021) + '...' : roles, inline: false },
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // add banner if user has one
        if (fetchedUser.banner) {
            embed.setImage(fetchedUser.bannerURL({ size: 1024 }));
        }

        await interaction.editReply({ embeds: [embed] });
    },
};
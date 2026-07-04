const { Events, EmbedBuilder } = require('discord.js');
const AutomodSettings = require('../models/AutomodSettings.js');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member, client) {
        if (!member.guild) {return;}

        const settings = await AutomodSettings.findOne({ guildId: member.guild.id });
        if (!settings?.enabled) {return;}

        const accountAge = Date.now() - member.user.createdTimestamp;
        const accountAgeDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));

        const logChannel = settings.logChannel
            ? member.guild.channels.cache.get(settings.logChannel)
            : null;

        // anti alts
        if (settings.antiAlts?.enabled) {
            const { minAge, action, logNewJoins } = settings.antiAlts;

            if (accountAgeDays < minAge) {
                // dm before action
                const dmEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle(`You were ${action === 'ban' ? 'banned' : 'kicked'} from ${member.guild.name}`)
                    .setDescription(`Your account is too new (${accountAgeDays} days old). Minimum account age required is ${minAge} days.`)
                    .setTimestamp();

                await member.send({ embeds: [dmEmbed] }).catch(() => null);

                if (action === 'ban' || action === 'kick+ban') {
                    await member.ban({ reason: `[AutoMod] Anti-Alt: Account too new (${accountAgeDays} days)` }).catch(() => null);
                }
                if (action === 'kick' || action === 'kick+ban') {
                    await member.kick(`[AutoMod] Anti-Alt: Account too new (${accountAgeDays} days)`).catch(() => null);
                }

                // log
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setAuthor({ name: 'AutoMod — Anti-Alts', iconURL: member.guild.iconURL() })
                        .setThumbnail(member.user.displayAvatarURL())
                        .addFields(
                            { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                            { name: '🗓️ Account Age', value: `${accountAgeDays} days`, inline: true },
                            { name: '⚡ Action', value: action, inline: true },
                        )
                        .setTimestamp();

                    await logChannel.send({ embeds: [embed] }).catch(() => null);
                }

                return; // dont run auto kick if alt check already triggered
            }

            // log new joins even if not an alt
            if (logNewJoins && logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setAuthor({ name: 'AutoMod — New Join', iconURL: member.guild.iconURL() })
                    .setThumbnail(member.user.displayAvatarURL())
                    .addFields(
                        { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                        { name: '🗓️ Account Age', value: `${accountAgeDays} days`, inline: true },
                        { name: '✅ Status', value: 'Passed alt check', inline: true },
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] }).catch(() => null);
            }
        }

        // auto kick new accounts
        if (settings.autoKick?.enabled) {
            const { minAge, reason } = settings.autoKick;

            if (accountAgeDays < minAge) {
                const dmEmbed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle(`You were kicked from ${member.guild.name}`)
                    .setDescription(`${reason} (Account age: ${accountAgeDays} days, required: ${minAge} days)`)
                    .setTimestamp();

                await member.send({ embeds: [dmEmbed] }).catch(() => null);
                await member.kick(`[AutoMod] Auto-Kick: ${reason}`).catch(() => null);

                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('Orange')
                        .setAuthor({ name: 'AutoMod — Auto-Kick', iconURL: member.guild.iconURL() })
                        .setThumbnail(member.user.displayAvatarURL())
                        .addFields(
                            { name: '👤 User', value: `${member.user.username} (<@${member.id}>)`, inline: true },
                            { name: '🗓️ Account Age', value: `${accountAgeDays} days`, inline: true },
                            { name: '📋 Reason', value: reason, inline: true },
                        )
                        .setTimestamp();

                    await logChannel.send({ embeds: [embed] }).catch(() => null);
                }
            }
        }
    },
};
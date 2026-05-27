const { EmbedBuilder } = require('discord.js');
const Warning = require('../models/Warning.js');

/**
 * Executes an automod action against a member
 * @param {object} options
 * @param {import('discord.js').GuildMember} options.member
 * @param {import('discord.js').Message} options.message
 * @param {string} options.action
 * @param {string} options.reason
 * @param {number} options.muteDuration - in seconds
 * @param {string} options.logChannelId
 * @param {string} options.ruleName
 */
module.exports = async ({
    member,
    message,
    action,
    reason,
    muteDuration = 60,
    logChannelId = null,
    ruleName,
}) => {

    const guild = member.guild;
    const user = member.user;

    // parse action string
    const doDelete = action.includes('delete');
    const doWarn = action.includes('warn');
    const doMute = action.includes('mute');

    // delete message
    if (doDelete && message) {
        await message.delete().catch(() => null);
    }

    // warn
    if (doWarn) {
        let userWarnings = await Warning.findOne({
            guildId: guild.id,
            userId: user.id,
        });

        if (!userWarnings) {
            userWarnings = new Warning({
                guildId: guild.id,
                userId: user.id,
                warnings: [],
            });
        }

        userWarnings.warnings.push({
            moderatorId: guild.client.user.id,
            reason: `[AutoMod - ${ruleName}] ${reason}`,
        });

        await userWarnings.save();

        // dm the user
        const dmEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`⚠️ You were warned in ${guild.name}`)
            .addFields(
                { name: '📋 Reason', value: reason, inline: true },
                { name: '🤖 By', value: 'AutoMod', inline: true },
                { name: '📌 Rule', value: ruleName, inline: true },
            )
            .setTimestamp();

        await user.send({ embeds: [dmEmbed] }).catch(() => null);
    }

    // mute / timeout
    if (doMute) {
        if (member.moderatable) {
            await member.timeout(muteDuration * 1000, `[AutoMod - ${ruleName}] ${reason}`)
                .catch(() => null);

            // dm the user
            const dmEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`🔇 You were timed out in ${guild.name}`)
                .addFields(
                    { name: '📋 Reason', value: reason, inline: true },
                    { name: '⏱️ Duration', value: `${muteDuration}s`, inline: true },
                    { name: '📌 Rule', value: ruleName, inline: true },
                )
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(() => null);
        }
    }

    // log to mod channel
    if (logChannelId) {
        const logChannel = guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const logEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setAuthor({ name: `AutoMod — ${ruleName}`, iconURL: guild.iconURL() })
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '👤 User', value: `${user.username} (<@${user.id}>)`, inline: true },
                { name: '📌 Rule', value: ruleName, inline: true },
                { name: '⚡ Action', value: action, inline: true },
                { name: '📋 Reason', value: reason, inline: true },
                { name: '📢 Channel', value: message ? `<#${message.channel.id}>` : 'N/A', inline: true },
            )
            .setTimestamp();

        await logChannel.send({ embeds: [logEmbed] }).catch(() => null);
    }
};
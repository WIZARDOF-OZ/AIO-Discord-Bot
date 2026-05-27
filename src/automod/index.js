const AutomodSettings = require('../models/AutomodSettings.js');
const executeAction = require('./action.js');

const antiSpam = require('./checks/antiSpam.js');
const antiLinks = require('./checks/antiLinks.js');
const antiCaps = require('./checks/antiCaps.js');
const antiMassmention = require('./checks/antiMassMention.js');
const mentionSpam = require('./checks/mentionSpam.js');
const badwords = require('./checks/badwords.js');
const antiPolls = require('./checks/antiPolls.js');

// cache settings per guild to avoid DB hit on every message
const settingsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSettings(guildId) {
    const cached = settingsCache.get(guildId);
    if (cached && Date.now() < cached.expiresAt) return cached.data;

    const settings = await AutomodSettings.findOne({ guildId });
    if (!settings) return null;

    settingsCache.set(guildId, {
        data: settings,
        expiresAt: Date.now() + CACHE_TTL,
    });

    return settings;
}

// export cache invalidation so automod setup command can clear it
function invalidateCache(guildId) {
    settingsCache.delete(guildId);
}

/**
 * Main automod handler — call this from messageCreate event
 * @param {import('discord.js').Message} message
 */
async function handleAutomod(message) {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.member) return;

    const settings = await getSettings(message.guild.id);
    if (!settings || !settings.enabled) return;

    // bypass roles check
    if (settings.bypassRoles.length) {
        const hasBypass = settings.bypassRoles.some(roleId =>
            message.member.roles.cache.has(roleId)
        );
        if (hasBypass) return;
    }

    // ignored channels check
    if (settings.ignoredChannels.includes(message.channel.id)) return;

    const logChannelId = settings.logChannel;

    // run each check
    const checks = [
        {
            name: 'Anti-Spam',
            enabled: settings.antiSpam.enabled,
            triggered: antiSpam(message, settings.antiSpam),
            action: settings.antiSpam.action,
            reason: 'Sending messages too fast',
            mute: settings.antiSpam.muteDuration,
        },
        {
            name: 'Anti-Links',
            enabled: settings.antiLinks.enabled,
            triggered: antiLinks(message, settings.antiLinks),
            action: settings.antiLinks.action,
            reason: 'Posting unauthorized links',
            mute: 60,
        },
        {
            name: 'Anti-Caps',
            enabled: settings.antiCaps.enabled,
            triggered: antiCaps(message, settings.antiCaps),
            action: settings.antiCaps.action,
            reason: 'Excessive use of capital letters',
            mute: 60,
        },
        {
            name: 'Anti-MassMention',
            enabled: settings.antiMassmention.enabled,
            triggered: antiMassmention(message, settings.antiMassmention),
            action: settings.antiMassmention.action,
            reason: 'Mass mentioning users or roles',
            mute: settings.antiMassmention.muteDuration,
        },
        {
            name: 'Mention-Spam',
            enabled: settings.mentionSpam.enabled,
            triggered: mentionSpam(message, settings.mentionSpam),
            action: settings.mentionSpam.action,
            reason: 'Spamming mentions across messages',
            mute: settings.mentionSpam.muteDuration,
        },
        {
            name: 'Badwords',
            enabled: settings.badwords.enabled,
            triggered: badwords(message, settings.badwords),
            action: settings.badwords.action,
            reason: 'Using prohibited words',
            mute: 60,
        },
        {
            name: 'Anti-Polls',
            enabled: settings.antiPolls.enabled,
            triggered: antiPolls(message, settings.antiPolls),
            action: settings.antiPolls.action,
            reason: 'Polls are not allowed here',
            mute: 60,
        },
    ];

    for (const check of checks) {
        if (!check.enabled || !check.triggered) continue;

        await executeAction({
            member: message.member,
            message,
            action: check.action,
            reason: check.reason,
            muteDuration: check.mute,
            logChannelId,
            ruleName: check.name,
        });

        break; // only trigger one rule per message
    }
}

module.exports = { handleAutomod, invalidateCache };
// tracks mention counts per user per guild
const mentionMap = new Map();

/**
 * @param {import('discord.js').Message} message
 * @param {object} settings - mentionSpam settings from DB
 * @returns {boolean}
 */
module.exports = (message, settings) => {
    const { threshold, interval } = settings;
    const key = `${message.guild.id}-${message.author.id}`;
    const now = Date.now();
    const mentions = message.mentions.users.size + message.mentions.roles.size;

    if (mentions === 0) return false;

    if (!mentionMap.has(key)) {
        mentionMap.set(key, { count: 0, resetAt: now + interval * 1000 });
    }

    const entry = mentionMap.get(key);

    // reset if window expired
    if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + interval * 1000;
    }

    entry.count += mentions;
    mentionMap.set(key, entry);

    // clean up after interval
    setTimeout(() => mentionMap.delete(key), interval * 1000);

    return entry.count >= threshold;
};
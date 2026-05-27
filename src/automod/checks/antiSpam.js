// tracks message timestaps per user per guild
const spamMap = new Map();

/**
 * @param {import('discord.js').Message} message
 * @param {object} settings - antiSpam settings from DB
 * @returns {boolean} - true if spam detected
 */

module.exports = (message, settings) => {
    const { threshold, interval } = settings
    const key = `${message.guild.id}-${message.author.id}`;
    const now = Date.now();


    if (!spamMap.has(key)) {
        spamMap.set(key, []);
    }

    const timestamps = spamMap.get(key);

    // filter out timestamps outside the interval window
    const windowStart = now - interval * 1000;
    const recent = timestamps.filter(t => t > windowStart);
    recent.push(now);
    spamMap.set(key, recent);

    // clean up map entry after interval to avoid memory leak
    setTimeout(() => {
        const current = spamMap.get(key) ?? [];
        const cleaned = current.filter(t => t > Date.now() - interval * 1000);
        if (cleaned.length === 0) {
            spamMap.delete(key);
        } else {
            spamMap.set(key, cleaned);
        }
    }, interval * 1000);

    return recent.length >= threshold;
}
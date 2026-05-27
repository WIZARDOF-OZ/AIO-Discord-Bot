/**
 * @param {import('discord.js').Message} message
 * @param {object} settings - badwords settings from DB
 * @returns {boolean}
 */
module.exports = (message, settings) => {
    const { words, matchType } = settings;
    if (!words.length) return false;

    const content = message.content.toLowerCase();

    return words.some(word => {
        if (matchType === 'partial') {
            return content.includes(word.toLowerCase());
        }
        // full match — word boundary
        const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
        return regex.test(content);
    });
};
/**
 * @param {import('discord.js').Message} message
 * @param {object} settings - antiCaps settings from DB
 * @returns {boolean}
 */
module.exports = (message, settings) => {
    const { percentage, minLength } = settings;
    const content = message.content;

    if (content.length < minLength) {return false;}

    const letters = content.replace(/[^a-zA-Z]/g, '');
    if (!letters.length) {return false;}

    const caps = content.replace(/[^A-Z]/g, '');
    const capsPercent = (caps.length / letters.length) * 100;

    return capsPercent >= percentage;
};
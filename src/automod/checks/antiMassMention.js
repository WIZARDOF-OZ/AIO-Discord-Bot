/**
 * @param {import('discord.js').Message} message
 * @param {object} settings - antiMassmention settings from DB
 * @returns {boolean}
 */
module.exports = (message, settings) => {
    const { threshold } = settings;
    const mentions = message.mentions.users.size + message.mentions.roles.size;
    return mentions >= threshold;
};
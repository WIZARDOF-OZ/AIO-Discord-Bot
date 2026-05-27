const { MessageType } = require('discord.js');

/**
 * @param {import('discord.js').Message} message
 * @param {object} settings - antiPolls settings from DB
 * @returns {boolean}
 */
module.exports = (message, settings) => {
    const { channels } = settings;

    // check if message is a poll
    if (message.type !== MessageType.Default) return false;
    if (!message.poll) return false;

    // if channels array is empty block polls everywhere
    if (channels.length === 0) return true;

    // otherwise only block in specified channels
    return channels.includes(message.channel.id);
};
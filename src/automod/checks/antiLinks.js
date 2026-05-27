const inviteRegex = /discord(?:\.gg|app\.com\/invite|\.com\/invite)\/[a-zA-Z0-9-]+/i;
const externalRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/i;

/**
 * @param {import('discord.js').Message} message
 * @param {object} settings - antiLinks settings from DB
 * @returns {boolean}
 */
module.exports = (message, settings) => {
    const { blockInvites, blockExternal } = settings;
    const content = message.content;

    if (blockInvites && inviteRegex.test(content)) return true;
    if (blockExternal && externalRegex.test(content)) return true;

    return false;
};
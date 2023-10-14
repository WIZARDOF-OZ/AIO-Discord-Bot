module.exports = {
    name: 'ping',
    description: 'pong',
    guildOnly: false,
    execute: (message, args) => {
        message.reply(`pong ` + ' ' + args)
    }
}
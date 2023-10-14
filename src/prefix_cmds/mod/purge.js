const { emoji } = require("../../config.js")

module.exports = {
    name: "purge",
    aliases: ['delete', 'clear'],
    cooldown: 2,
    category: "mod",
    description: 'Use to delete messages',
    ownerOnly: false,
    enabled: true,
    memberPermissions: ['ManageMessages'],

    execute: async (message, args) => {
        try {
            // if (!message.member.permissions.has('ManageMessages')) return message.reply("You Don't Have MANAGE MESSAGES Perms");

            if (!args[0]) return message.reply(`${emoji.error} | Please enter the amount of messages to clear`);

            if (isNaN(args[0])) return message.reply(`${emoji.error} | Please type a real number!`);

            if (args[0] > 1000) return message.reply(`${emoji.error} | You can't remove more than 1000 messages!`);

            if (args[0] < 1) return message.reply(`${emoji.error} | You have to delete at least one message!`);
            await message.channel.messages.fetch({ limit: args[0] }).then(async n => {
                await message.channel.bulkDelete(n)
                await message.channel.send(`${emoji.success} | ${message.author} | Deleted ${n.size} Messages `).then(message => setTimeout(() => message.delete(), 4000))
            })

        } catch (error) {
            message.reply(`${error.stack}`)
            console.log(error)
        }

    }
}
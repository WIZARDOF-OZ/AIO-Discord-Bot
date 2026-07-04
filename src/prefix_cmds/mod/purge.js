const { emoji, color } = require("../../config.js")
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js")
module.exports = {
    name: "purge",
    aliases: ['delete', 'clear'],
    cooldown: 2,
    category: "mod",
    description: 'Use to delete messages',
    usage: "purge <amount>",
    args: true,
    memberPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
    guildOnly: true,
    requiredRoles: ['835797270913482802'], // role IDS

    async execute(aio, message, args) {
        const amount = parseInt(args[0])



        if (isNaN(amount)) {return message.reply(`${emoji.error} Please provide a valid number.`);}
        if (amount < 1) {return message.reply(`${emoji.error} You need to delete at least 1 message.`);}
        if (amount > 100) {return message.reply(`${emoji.error} You can only delete up to 100 messages at a time.`);}

        await message.delete().catch(() => null);

        const messages = await message.channel.messages.fetch({ limit: amount })

        const deletable = messages.filter(m => {
            const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
            return m.createdTimestamp > twoWeeksAgo;

        });

        if (!deletable.size) {return message.reply(`${emoji.error} | No messages to delete! Messages older than 14 days cannot be deleted!`);}

        const deleted = await message.channel.bulkDelete(deletable, true).catch(err => {
            console.log(' [Purge Error]', err);
            return null;
        });

        if (!deleted) {return message.channel.send(`${emoji.error} Something went wrong while deleting messages.`);}
        const embed = new EmbedBuilder()
            .setColor(color.success)
            .setDescription(`${emoji.success} Deleted **${deleted.size}** message(s) in ${message.channel}.`)
            .setFooter({ text: `Purged by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const reply = await message.channel.send({ embeds: [embed] });
        setTimeout(() => reply.delete().catch(() => null), 5000);
    }
}
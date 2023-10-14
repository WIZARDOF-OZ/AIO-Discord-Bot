const { WebhookClient, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'webhook',
    async execute(client, message, args) {
        const wc = new WebhookClient('1155945940105048154')

        const embed = new EmbedBuilder()
            .setTitle("this is an embed").setColor('Green').setTimestamp().setDescription(args.join(" "))
        wc.send({
            username: message.author.tag,
            avatarURL: message.author.displayAvatarURL({ dynamic: true }),
            embeds: [embed]
        })
    }
}
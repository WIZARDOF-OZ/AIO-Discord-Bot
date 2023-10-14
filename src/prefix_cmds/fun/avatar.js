const Discord = require("discord.js");

module.exports = {

    name: "avatar",
    aliases: ["av", 'icon'],
    description: "Display a user avatar",
    usage: "avatar [@user | user ID]",
    category: "fun",
    guildOnly: true,

    execute: async (message, args) => {
        let user;

        if (message.mentions.users.first()) {
            user = message.mentions.users.first();

        } else if (args[0]) {

            user = message.guild.members.cache.get(args[0]).user;

        } else {
            user = message.author;
        }

        let target = message.mentions.members.first() || message.member;
        if (!target) return message.author;

        let avatar = user.displayAvatarURL({ size: 4096, dynamic: true, format: "png" });

        const embed = new Discord.EmbedBuilder()

            .setTitle(`${user.tag} avatar`)
            .setDescription(`[Download the avatar](${avatar})`)
            .setColor(target.roles.highest.hexColor)
            .setImage(avatar);

        return message.channel.send({ embeds: [embed] });
    }
};
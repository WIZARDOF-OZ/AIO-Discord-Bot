const { EmbedBuilder } = require("discord.js");
const { cooldown } = require("./8ball");

module.exports = {

    name: "avatar",
    aliases: ["av", 'icon'],
    description: "Display a user avatar",
    usage: "avatar [@user | user ID]",
    category: "fun",
    guildOnly: true,
    cooldown: 3,

    async execute(aio, message, args) {
        let member;

        if (message.mentions.members.first()) {
            member = message.mentions.members.first();

        } else if (args[0]) {
            const id = args[0].replace(/[^0-9]/g, ''); // Remove non-numeric characters
            member = await message.guild.members.fetch(id).catch(() => null);

        } else {
            member = message.member;
        }
        console.log('member:', member);
        console.log('args[0]:', args[0]);

        if (!member) {
            return message.reply(`${emoji.error} No user found, please mention them or provide a valid user ID.`);
        }

        const user = member.user;


        const avatar = user.displayAvatarURL({ size: 4096, extension: "png", forceStatic: false });

        const embed = new EmbedBuilder()

            .setTitle(`${user.username} avatar`)
            .setDescription(`[Download the avatar](${avatar})`)
            .setColor(member.roles.highest.hexColor)
            .setImage(avatar);

        return message.reply({ embeds: [embed] });
    }
};
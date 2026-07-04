const { EmbedBuilder } = require("discord.js");

module.exports = {

    name: "howgay",
    aliases: ["hg"],
    category: "fun",
    description: "Shows How Member Gay Is!",
    usage: "howgay <Mention Member>",
    guildOnly: true,

    async execute(aio, message, args) {
        //Start

        const member = message.mentions.users.first() ?? (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null) ?? message.member;
        if (!member) {return message.reply("Couldn't find that member, try again!");}

        const Result = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`🏳️‍🌈 Gayness Meter`)
            .setDescription(`${member.user.username} Is **${Result}%** Gay 🏳️‍🌈`)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.reply({ embeds: [embed] });

        //End
    }
};
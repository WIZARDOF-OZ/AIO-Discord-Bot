const { EmbedBuilder } = require("discord.js");

module.exports = {

    name: "howgay",
    aliases: ["hg"],
    category: "Fun",
    description: "Shows How Member Gay Is!",
    usage: "howgay <Mention Member>",

    async execute(message, args) {
        //Start

        let Member = message.mentions.users.first() || message.author || message.member;

        let Result = Math.floor(Math.random() * 101);

        let embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`About your Gayness`)
            .setDescription(`${Member.username} Is ${Result}% Gay 🏳️‍🌈`)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        //End
    }
};
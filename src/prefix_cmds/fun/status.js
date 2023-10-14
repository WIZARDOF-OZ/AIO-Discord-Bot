const { EmbedBuilder } = require('discord.js');

module.exports = {

    name: "status",
    category: "fun",
    aliases: [""],
    description: "Shows status of users",
    usage: "status <@user>",

    async execute(message, args) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

        if (!user.presence.activities.length) {
            const sembed = new EmbedBuilder()
                .setAuthor({ name: user.user.username, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
                .setColor("Green")
                .setThumbnail(user.user.displayAvatarURL())
                // .addFields({ name: "**No Status**", value: 'This user does not have any custom status!' })
                .setDescription(`**No Status**, This user does not have any custom status!`)
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                .setTimestamp()
            message.channel.send({ embeds: [sembed] })
            return undefined;
        }

        user.presence.activities.forEach((activity) => {

            if (activity.type === 'CUSTOM_STATUS') {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: user.user.username, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
                    .setColor("Green")
                    .addField("**Status**", `**Custom status** -\n${activity.emoji || "No Emoji"} | ${activity.state}`)
                    .addFields({ name: "**Status**, **Custom Status** -", value: `\n ${activity.emoji || "No Emoji"} | ${activity.state}` })
                    .setThumbnail(user.user.displayAvatarURL())
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
            }
            else if (activity.type === 'PLAYING') {
                let name1 = activity.name
                let details1 = activity.details
                let state1 = activity.state
                let image = user.user.displayAvatarURL({ dynamic: true })

                const sembed = new EmbedBuilder()
                    .setAuthor(`${user.user.username}'s Activity`)
                    .setColor(0xFFFF00)
                    .setThumbnail(image)
                    .addFields({ name: "**Type**", value: "Playing" })
                    .addFields({ name: "**App**", value: `${name1}` })
                    .addFields({ name: "**Details**", value: `${details1 || "No Details"}` })
                    .addFields({ name: "**Working on**", value: `${state1 || "No Details"}` })
                message.channel.send({ embeds: [sembed] });
            }
            else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {

                let trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
                let trackURL = `https://open.spotify.com/track/${activity.syncID}`;

                let trackName = activity.details;
                let trackAuthor = activity.state;
                let trackAlbum = activity.assets.largeText;

                trackAuthor = trackAuthor.replace(/;/g, ",")

                const embed = new EmbedBuilder()
                    .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
                    .setColor("GREEN")
                    .setThumbnail(trackIMG)
                    .addField({ name: 'Song Name', value: trackName, inline: true })
                    .addField({ name: 'Album', value: trackAlbum, inline: true })
                    .addField({ name: 'Author', value: trackAuthor, inline: false })
                    .addField({ name: 'Listen to Track', value: `${trackURL}`, inline: false })
                    .setFooter(user.displayName, user.user.displayAvatarURL({ dynamic: true }))
                message.channel.send({ embeds: [embed] });
            }
        })
    }
}
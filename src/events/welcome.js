const { Events, EmbedBuilder } = require('discord.js');

const config = require("../../JSON/guildMemberAdd_Config.json");
/**
 * 
 * @param {Client} client 
 */
module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member, client) {
        const { guild } = member;
        const target = config.find(x => x.guildId == guild.id);
        if (!target) return;
        const channel = await guild.channels.cache.get(target.channelId);
        if (!channel) return;

        const value = [
            `<:p_dot:837257989563744256> ${member.displayName}, Just Join Our Server!`,
            `<:p_dot:837257989563744256> Make sure to read our rules first.`,
            `<:p_dot:837257989563744256> Get some roles yourself.`,
            `<:p_dot:837257989563744256> Chat with other members.`
        ];


        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.displayName} Just Join Our Server ${guild.name}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(value.map(x => `> ${x}`).join("\n"))
            .setColor(0xfa9e48)
            .setImage(`https://cdn.discordapp.com/attachments/829287239732559912/852800000463339541/welcome_anime_girl_dc.jpeg`)
            // .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }})
            .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setTimestamp();
        channel.send({ embeds: [embed], content: `${member}` });
    }

}

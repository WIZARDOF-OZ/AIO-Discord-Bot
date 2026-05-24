const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const process = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Shows detailed information about the bot')
        .setDMPermission(false),
    category: 'owner',

    async execute(interaction) {
        await interaction.deferReply();

        const { client } = interaction;

        // uptime
        const totalSeconds = Math.floor(process.uptime());
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // memory
        const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const memTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        // counts
        const guildCount = client.guilds.cache.size;
        const channelCount = client.channels.cache.size;
        const userCount = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '🤖 Bot Name', value: client.user.username, inline: true },
                { name: '🆔 Bot ID', value: client.user.id, inline: true },
                { name: '📅 Created At', value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:F>`, inline: false },
                { name: '⏱️ Uptime', value: uptime, inline: true },
                { name: '📡 Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
                { name: '🏠 Servers', value: `${guildCount}`, inline: true },
                { name: '📢 Channels', value: `${channelCount}`, inline: true },
                { name: '👥 Total Users', value: `${userCount}`, inline: true },
                { name: '💾 Memory Usage', value: `${memUsed}MB / ${memTotal}GB`, inline: true },
                { name: '🟢 Node.js', value: process.version, inline: true },
                { name: '📦 Discord.js', value: `v${require('discord.js').version}`, inline: true },
                { name: '⚡ Commands', value: `${client.commands.size} slash / ${client.prefix_cmds.size} prefix`, inline: false },
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
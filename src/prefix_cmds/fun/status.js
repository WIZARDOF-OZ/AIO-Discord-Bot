const { EmbedBuilder, ActivityType } = require('discord.js');

module.exports = {
    name: 'status',
    aliases: ['activity'],
    description: 'Shows the current activity/status of a user',
    usage: '[@user | userID]',
    category: 'fun',
    guildOnly: true,
    cooldown: 3,

    async execute(bio, message, args) {
        const member = message.mentions.members.first()
            ?? (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null)
            ?? message.member;

        if (!member) return message.reply('❌ Could not find that user, please mention them or provide a valid ID.');

        const { presence } = member;

        // No presence data at all
        if (!presence || !presence.activities.length) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
                .setColor('Grey')
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription('This user has no current activity.')
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        // Loop through all activities and send one embed per activity


        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username}'s Status`, iconURL: member.user.displayAvatarURL() })
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Random')
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
            .setTimestamp();

        for (const activity of presence.activities) {

            if (activity.type === ActivityType.Custom) {
                embed.addFields({
                    name: '💬 Custom Status',
                    value: `${activity.emoji ?? ''} ${activity.state ?? 'No status text'}`.trim(),
                });
            }

            else if (activity.type === ActivityType.Playing) {
                embed.addFields({
                    name: '🎮 Playing',
                    value: [
                        `**Game:** ${activity.name}`,
                        `**Details:** ${activity.details ?? 'No details'}`,
                        `**State:** ${activity.state ?? 'No state'}`,
                    ].join('\n'),
                });
            }

            else if (activity.type === ActivityType.Listening && activity.name === 'Spotify') {
                const trackURL = `https://open.spotify.com/track/${activity.syncId}`;
                embed.setThumbnail(activity.assets?.largeImageURL() ?? member.user.displayAvatarURL());
                embed.addFields({
                    name: '🎵 Listening to Spotify',
                    value: [
                        `**Song:** ${activity.details ?? 'Unknown'}`,
                        `**Artist:** ${activity.state?.replace(/;/g, ',') ?? 'Unknown'}`,
                        `**Album:** ${activity.assets?.largeText ?? 'Unknown'}`,
                        `**[Listen on Spotify](${trackURL})**`,
                    ].join('\n'),
                });
            }

            else if (activity.type === ActivityType.Streaming) {
                embed.addFields({
                    name: '🔴 Streaming',
                    value: [
                        `**Game:** ${activity.name}`,
                        `**Details:** ${activity.details ?? 'No details'}`,
                        `**URL:** ${activity.url ?? 'No URL'}`,
                    ].join('\n'),
                });
            }
        }

        message.reply({ embeds: [embed] });

    },
};
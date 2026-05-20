const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const ms = require('ms');
const { usage } = require('./purge');
const { emoji, prefix } = require('../../config');
module.exports = {

    name: "slowmode",
    category: 'mod',
    description: "Set the slowmode for the channel!",
    permissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages],
    aliases: ['sm'],
    usage: "slowmode <time/off> [reason]",
    args: true,
    guildOnly: true,
    cooldown: 2,

    async execute(aio, message, args) {

        if (
            !message.guild.members.me.permissions.has(
                PermissionFlagsBits.ManageChannels
            )
        ) {
            return message.reply({
                content:
                    "❌ I need **Manage Channels** permission."
            });
        }
        if (!args[0]) {
            return message.reply({
                content:
                    `Usage: \`${prefix}slowmode <time/off> [reason]\`\nExamples:\n\`!slowmode 10s spam control\`\n\`!slowmode 5m\`\n\`!slowmode off\``
            });
        }

        const currentCooldown = message.channel.rateLimitPerUser;

        const reason = args[1] ? args.slice(1).join(' ') : 'No reason provided';

        // Turn off slowmode

        if (args[0].toLowerCase() === 'off') {
            if (currentCooldown === 0) return message.reply("Slowmode is already off!");

            await message.channel.setRateLimitPerUser(0, reason);
            return message.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(` ${emoji.success} Slowmode has been turned off!\nReason: ${reason}`)
                            .setFooter({ text: `Changed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                            .setTimestamp()
                    ]
                }
            );

        }
        // Convert time
        const time = ms(args[0]);

        if (!time) {
            return message.reply({
                content:
                    "❌ Invalid time.\nExamples: `10s`, `1m`, `5m`, `1h`"
            });
        }

        const seconds = Math.floor(time / 1000);

        // Discord max = 21600 sec = 6h
        if (seconds > 21600) {
            return message.reply({
                content:
                    "❌ Maximum slowmode is **6 hours**."
            });
        }
        if (currentCooldown === seconds) {
            return message.reply({
                content:
                    `⚠️ Slowmode already set to **${args[0]}**`
            });
        }

        await message.channel.setRateLimitPerUser(
            seconds,
            reason
        );

        const embed = new EmbedBuilder()
            .setTitle("🐢 Slowmode Enabled")
            .addFields(
                {
                    name: "Duration",
                    value: args[0],
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason,
                    inline: true
                }
            )
            .setColor("Orange")
            .setFooter({
                text: `${message.author.tag}`,
                iconURL:
                    message.author.displayAvatarURL()
            });

        return message.channel.send({
            embeds: [embed]
        });


    },
};
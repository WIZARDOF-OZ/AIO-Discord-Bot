const { EmbedBuilder } = require('discord.js');

const ms = require('ms');
module.exports = {

    name: "slowmode",
    category: 'mod',
    description: "Set the slowmode for the channel!",
    permissions: 'MANAGE_CHANNELS',
    aliases: ['sm'],
    guildOnly: false,

    execute: async (message, args) => {

        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send('You do not have **MANAGE_CHANNELS** permission!').then(m => m.delete({ timeout: 10000 }));

        if (!args[0]) return message.channel.send('You did not specify a time!').then(m => m.delete({ timeout: 5000 }));

        const currentCooldown = message.channel.rateLimitPerUser;

        const reason = args[1] ? args.slice(1).join(' ') : 'no reason';

        const embed = new EmbedBuilder()
            .setFooter({ text: `${message.author.tag} | ${message.author.id}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

        if (args[0] === 'off') {

            if (currentCooldown === 0) return message.channel.send('Channel cooldown is already off').then(m => m.delete({ timeout: 5000 }));

            embed.setTitle('Slowmode Disabled')
                .setColor('#00ff00');
            return message.channel.setRateLimitPerUser(0, reason);

        }

        const time = ms(args[0]) / 1000;

        if (isNaN(time)) return message.channel.send('not a valid time, please try again!').then(m => m.delete({ timeout: 5000 }));

        if (time >= 21600) return message.channel.send('That slowmode limit is too high, please enter anything lower than 6 hours.').then(m => m.delete({ timeout: 5000 }));

        if (currentCooldown === time) return message.channel.send(`Slowmode is already set to ${args[0]}`);

        embed.setTitle('Slowmode Enabled')
            .addFields([
                { name: 'Slowmode:', value: args[0] },
                { name: 'Reason:', value: reason },
            ])
            .setColor(0xff0000);

        message.channel.setRateLimitPerUser(time, reason).then(m => m.send({ embeds: [embed] }));

    },
};
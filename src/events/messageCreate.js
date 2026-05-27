const { Events, EmbedBuilder, Collection, ChannelType } = require('discord.js');
const { prefix, emoji, color, owners } = require('../config.js');
const { handleAutomod } = require('../automod/index.js')
module.exports = {
    name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     */
    async execute(message, aio) {
        await handleAutomod(message, aio);
        if (message.author.bot) return;
        if (!message.guild) return;

        // Prefix checkinng
        const mentionRegex = new RegExp(`^<@!?${aio.user.id}>\\s`);
        let usedPrefix;

        if (mentionRegex.test(message.content)) {
            usedPrefix = message.content.match(mentionRegex)[0];

        } else if (message.content.startsWith(prefix)) {
            usedPrefix = prefix;
        } else {
            return;
        }

        // parse args
        const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        if (!commandName) return;

        // Find the command
        const command = aio.prefix_cmds.get(commandName) || aio.prefix_cmds.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.react('<:woot:1124216085407866911>');


        // Guild only check
        if (command.guildOnly && message.channel.type === ChannelType.DM) {
            return message.reply('This command can only be used in servers!');
        }

        // Owner only check
        if (command.ownerOnly && !owners.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color.error)
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`${emoji.error} Only the bot owner can use this command.`),
                ],
            });
        }

        // Missing args check
        if (command.args && !args.length) {
            const usageHint = command.usage
                ? `\nUsage: \`${prefix}${command.name} ${command.usage}\``
                : '';
            return message.reply(`${emoji.error} You didn't provide any arguments!${usageHint}`);
        }

        // Member permissions check
        const missingPerms = (command.memberPermissions ?? []).filter(
            perm => !message.member.permissions.has(perm),
        );

        if (missingPerms.length) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color.error)
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(
                            `${emoji.error} You're missing the following permissions:\n${missingPerms.map(p => `**• ${p}**`).join('\n')}`
                        ),
                ],
            });
        }

        // cooldown

        const { cooldowns } = aio;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown ?? 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expiry = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expiry) {
                const timeLeft = ((expiry - now) / 1000).toFixed(1);
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Orange')
                            .setDescription(`${emoji.error} Please wait **${timeLeft}s** before reusing \`${command.name}\`.`),
                    ],
                });
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // Role check
        if (command.requiredRoles?.length) {
            const hasRole = command.requiredRoles.some(roleId => message.member.roles.cache.has(roleId))
            if (!hasRole) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color.error)
                            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                            .setDescription(`${emoji.error} You need one of the following roles to use this command:\n${command.requiredRoles.map(id => `<@&${id}>`).join(',\n')}`)
                    ]
                })
            }
        }

        // Execute the command
        try {
            await command.execute(aio, message, args, args.join(' '));
        } catch (error) {
            console.error(`[Prefix] Error in ${command.name}:`, error);
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color.error)
                        .setTitle('An Unexpected Error Occurred')
                        .setDescription(`\`\`\`js\n${error.message}\`\`\``),
                ],
            }).catch(() => { });
        }
    },
};
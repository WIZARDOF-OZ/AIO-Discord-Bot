const { Events, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const AutomodSettings = require('../models/AutomodSettings.js');
const { invalidateCache } = require('../automod/index.js');

// tracks join timestamps per guild
const raidMap = new Map();

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member, client) {
        if (!member.guild) return;

        const settings = await AutomodSettings.findOne({ guildId: member.guild.id });
        if (!settings?.enabled || !settings?.antiRaid?.enabled) return;

        const { threshold, interval, action, lockChannels, raiseVerification, lockDuration } = settings.antiRaid;
        const guildId = member.guild.id;
        const now = Date.now();

        // track joins
        if (!raidMap.has(guildId)) raidMap.set(guildId, []);
        const joins = raidMap.get(guildId);

        // filter joins within interval window
        const windowStart = now - interval * 1000;
        const recentJoins = joins.filter(t => t > windowStart);
        recentJoins.push(now);
        raidMap.set(guildId, recentJoins);

        // clean up after interval
        setTimeout(() => {
            const current = raidMap.get(guildId) ?? [];
            const cleaned = current.filter(t => t > Date.now() - interval * 1000);
            if (cleaned.length === 0) raidMap.delete(guildId);
            else raidMap.set(guildId, cleaned);
        }, interval * 1000);

        // not a raid yet
        if (recentJoins.length < threshold) return;

        console.warn(`[AutoMod] Raid detected in ${member.guild.name} — ${recentJoins.length} joins in ${interval}s`);

        // clear join tracking to avoid repeated triggers
        raidMap.delete(guildId);

        const guild = member.guild;

        // fetch all recent joiners to action them
        await guild.members.fetch();
        const raiders = guild.members.cache
            .filter(m => m.joinedTimestamp && m.joinedTimestamp > windowStart)
            .values();

        // action each raider
        for (const raider of raiders) {
            if (raider.user.bot) continue;
            if (!raider.kickable) continue;

            if (action === 'ban') {
                await raider.ban({ reason: '[AutoMod] Anti-Raid triggered' }).catch(() => null);
            } else {
                await raider.kick('[AutoMod] Anti-Raid triggered').catch(() => null);
            }
        }

        // lock all text channels
        if (lockChannels) {
            const textChannels = guild.channels.cache.filter(c =>
                c.type === ChannelType.GuildText &&
                c.permissionsFor(guild.roles.everyone).has(PermissionFlagsBits.SendMessages)
            );

            for (const [, channel] of textChannels) {
                await channel.permissionOverwrites.edit(guild.roles.everyone, {
                    SendMessages: false,
                }).catch(() => null);
            }

            // unlock after lockDuration
            setTimeout(async () => {
                for (const [, channel] of textChannels) {
                    await channel.permissionOverwrites.edit(guild.roles.everyone, {
                        SendMessages: null,
                    }).catch(() => null);
                }
                console.log(`[AutoMod] Raid lockdown lifted in ${guild.name}`);
            }, lockDuration * 1000);
        }

        // raise verification level (option C)
        if (raiseVerification) {
            const originalLevel = guild.verificationLevel;
            await guild.setVerificationLevel(4, '[AutoMod] Anti-Raid triggered').catch(() => null);

            // restore after lockDuration
            setTimeout(async () => {
                await guild.setVerificationLevel(originalLevel, '[AutoMod] Raid over').catch(() => null);
            }, lockDuration * 1000);
        }

        // log to mod channel
        if (settings.logChannel) {
            const logChannel = guild.channels.cache.get(settings.logChannel);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor({ name: 'AutoMod — Anti-Raid', iconURL: guild.iconURL() })
                    .setTitle('🚨 Raid Detected!')
                    .addFields(
                        { name: '👥 Joins Detected', value: `${recentJoins.length} joins in ${interval}s`, inline: true },
                        { name: '⚡ Action', value: action, inline: true },
                        { name: '🔒 Locked', value: lockChannels ? `Yes (${lockDuration}s)` : 'No', inline: true },
                        { name: '🔐 Verification', value: raiseVerification ? 'Raised' : 'Unchanged', inline: true },
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] }).catch(() => null);
            }
        }
    },
};
const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    SectionBuilder,
    ThumbnailBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require('discord.js');

// module metadata
const MODULES = {
    antiSpam: {
        label: 'Anti-Spam',
        emoji: '🚫',
        description: 'Detects users sending too many messages in a short time window. Perfect for preventing message floods and bot attacks.',
        fields: (s) => [
            `**Threshold:** ${s.threshold} messages`,
            `**Interval:** ${s.interval} seconds`,
            `**Action:** \`${s.action}\``,
            `**Mute Duration:** ${s.muteDuration}s`,
        ],
    },
    antiLinks: {
        label: 'Anti-Links',
        emoji: '🔗',
        description: 'Blocks Discord invite links and/or external URLs from being posted in your server.',
        fields: (s) => [
            `**Block Invites:** ${s.blockInvites ? 'Yes' : 'No'}`,
            `**Block External:** ${s.blockExternal ? 'Yes' : 'No'}`,
            `**Action:** \`${s.action}\``,
        ],
    },
    antiCaps: {
        label: 'Anti-Caps',
        emoji: '🔠',
        description: 'Filters messages with excessive capital letters. Keeps your chat clean and readable.',
        fields: (s) => [
            `**Percentage:** ${s.percentage}% caps`,
            `**Min Length:** ${s.minLength} characters`,
            `**Action:** \`${s.action}\``,
        ],
    },
    badwords: {
        label: 'Badwords Filter',
        emoji: '🤬',
        description: 'Automatically deletes messages containing prohibited words. Supports full and partial word matching.',
        fields: (s) => [
            `**Words:** ${s.words.length} word(s) configured`,
            `**Match Type:** ${s.matchType ?? 'full'}`,
            `**Action:** \`${s.action}\``,
        ],
    },
    antiMassmention: {
        label: 'Anti-MassMention',
        emoji: '📢',
        description: 'Prevents users from mentioning many people or roles in a single message. Stops mention spam attacks.',
        fields: (s) => [
            `**Threshold:** ${s.threshold} mentions`,
            `**Action:** \`${s.action}\``,
            `**Mute Duration:** ${s.muteDuration}s`,
        ],
    },
    mentionSpam: {
        label: 'Mention Spam',
        emoji: '🏓',
        description: 'Tracks mentions across multiple messages over a time window. Catches spammers who spread mentions across messages.',
        fields: (s) => [
            `**Threshold:** ${s.threshold} total mentions`,
            `**Interval:** ${s.interval} seconds`,
            `**Action:** \`${s.action}\``,
            `**Mute Duration:** ${s.muteDuration}s`,
        ],
    },
    antiPolls: {
        label: 'Anti-Polls',
        emoji: '📊',
        description: 'Automatically removes polls in specified channels or across the whole server.',
        fields: (s) => [
            `**Restricted Channels:** ${s.channels.length ? s.channels.map(c => `<#${c}>`).join(', ') : 'All channels'}`,
            `**Action:** \`${s.action}\``,
        ],
    },
    antiRaid: {
        label: 'Anti-Raid',
        emoji: '🚨',
        description: 'Detects mass member joins and automatically locks down your server. Kicks or bans raiders and optionally raises verification level.',
        fields: (s) => [
            `**Threshold:** ${s.threshold} joins`,
            `**Interval:** ${s.interval} seconds`,
            `**Action:** \`${s.action}\``,
            `**Lock Channels:** ${s.lockChannels ? 'Yes' : 'No'}`,
            `**Raise Verification:** ${s.raiseVerification ? 'Yes' : 'No'}`,
            `**Lock Duration:** ${s.lockDuration}s`,
        ],
    },
    antiAlts: {
        label: 'Anti-Alts',
        emoji: '👥',
        description: 'Automatically kicks or bans accounts that are too new. Protects against alt account abuse and new account raids.',
        fields: (s) => [
            `**Min Age:** ${s.minAge} days`,
            `**Action:** \`${s.action}\``,
            `**Reason:** ${s.reason ?? 'Account too new'}`,
            `**Log New Joins:** ${s.logNewJoins ? 'Yes' : 'No'}`,
        ],
    },
};

const ACTION_CHOICES = {
    // message based modules
    default: [
        { label: 'Delete', value: 'delete' },
        { label: 'Warn', value: 'warn' },
        { label: 'Mute', value: 'mute' },
        { label: 'Delete + Warn', value: 'delete+warn' },
        { label: 'Delete + Mute', value: 'delete+mute' },
        { label: 'Warn + Mute', value: 'warn+mute' },
        { label: 'Delete + Warn + Mute', value: 'delete+warn+mute' },
    ],
    // member join modules
    member: [
        { label: 'Kick', value: 'kick' },
        { label: 'Ban', value: 'ban' },
        { label: 'Kick+Ban', value: 'kick+ban' },
    ],
    // anti raid
    raid: [
        { label: 'Kick', value: 'kick' },
        { label: 'Ban', value: 'ban' },
    ],
};
// build the main panel container
function buildMainPanel(settings, guild) {
    const moduleStatus = Object.entries(MODULES).map(([key, mod]) => {
        const enabled = settings[key]?.enabled ?? false;
        return `${mod.emoji} **${mod.label}** — ${enabled ? '✅ Active' : '❌ Disabled'}`;
    }).join('\n');

    const container = new ContainerBuilder()
        // header
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('# 🤖 AutoMod Control Panel'),
                    new TextDisplayBuilder().setContent(
                        `**${guild.name}**\n\nAutoMod is a powerful moderation system that automatically protects your server from spam, raids, bad words and more. Configure each module below to suit your server's needs.`
                    ),
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder().setURL(guild.iconURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png')
                )
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        )
        // system status
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                [
                    `## ⚙️ System Status`,
                    `**Status:** ${settings.enabled ? '🟢 Active' : '🔴 Inactive'}`,
                    `**Log Channel:** ${settings.logChannel ? `<#${settings.logChannel}>` : '❌ Not set — use 📋 Log Channel button'}`,
                    `**Bypass Roles:** ${settings.bypassRoles?.length ? settings.bypassRoles.map(r => `<@&${r}>`).join(', ') : '❌ None — use 🛡️ Bypass button'}`,
                    `**Ignored Channels:** ${settings.ignoredChannels?.length ? settings.ignoredChannels.map(c => `<#${c}>`).join(', ') : '❌ None — use 🔇 Ignore button'}`,
                ].join('\n')
            )
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        )
        // module overview
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`## 📊 Module Overview\n${moduleStatus}`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        )
        // help text
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `## 💡 How to Use\n> 1. Click **🟢 Enable** to activate AutoMod\n> 2. Set a **📋 Log Channel** to track actions\n> 3. Use the **Configure a Module** dropdown to set up each rule\n> 4. Optionally add **🛡️ Bypass Roles** for staff immunity\n> ⏱️ This panel expires after **5 minutes** of inactivity`
            )
        );

    return container;
}

// build module detail panel
function buildModulePanel(moduleKey, settings, guild) {
    const mod = MODULES[moduleKey];
    const modData = settings[moduleKey];
    const enabled = modData?.enabled ?? false;
    const fields = mod.fields(modData).join('\n');

    const container = new ContainerBuilder()
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`# ${mod.emoji} ${mod.label}`),
                    new TextDisplayBuilder().setContent(mod.description),
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder().setURL(guild.iconURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png')
                )
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `## ⚙️ Current Settings\n**Status:** ${enabled ? '✅ Active' : '❌ Disabled'}\n${fields}`
            )
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `> Use the buttons below to enable, disable or configure this module.\n> Changes take effect immediately.`
            )
        );

    return container;
}

// build main panel action rows
function buildMainRows(settings) {
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('automod_enable')
            .setLabel('Enable')
            .setEmoji('🟢')
            .setStyle(settings.enabled ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('automod_disable')
            .setLabel('Disable')
            .setEmoji('🔴')
            .setStyle(!settings.enabled ? ButtonStyle.Danger : ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('automod_logchannel')
            .setLabel('Log Channel')
            .setEmoji('📋')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('automod_bypass')
            .setLabel('Bypass Roles')
            .setEmoji('🛡️')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('automod_ignore')
            .setLabel('Ignore Channels')
            .setEmoji('🔇')
            .setStyle(ButtonStyle.Primary),
    );

    const row2 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('automod_module_select')
            .setPlaceholder('📂 Configure a Module...')
            .addOptions(
                Object.entries(MODULES).map(([key, mod]) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(mod.label)
                        .setDescription(mod.description.slice(0, 100))
                        .setValue(key)
                        .setEmoji(mod.emoji)
                )
            )
    );

    return [row1, row2];
}

// build module panel action rows
function buildModuleRows(moduleKey) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`automod_mod_enable_${moduleKey}`)
            .setLabel('Enable')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`automod_mod_disable_${moduleKey}`)
            .setLabel('Disable')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`automod_mod_configure_${moduleKey}`)
            .setLabel('Configure')
            .setEmoji('⚙️')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('automod_back')
            .setLabel('Back')
            .setEmoji('🔙')
            .setStyle(ButtonStyle.Secondary),
    );

    return [row];
}

// build action select menu (shown before configure modal)
function buildActionSelect(moduleKey) {
    const actionType = MODULE_ACTION_TYPE[moduleKey] ?? 'default';
    const choices = ACTION_CHOICES[actionType];

    const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`automod_action_select_${moduleKey}`)
            .setPlaceholder('⚡ Select an action first...')
            .addOptions(
                choices.map(c =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(c.label)
                        .setValue(c.value)
                )
            )
    );

    const backRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`automod_mod_back_${moduleKey}`)
            .setLabel('Back')
            .setEmoji('🔙')
            .setStyle(ButtonStyle.Secondary),
    );

    return [row, backRow];
}

const MODULE_ACTION_TYPE = {
    antiSpam: 'default',
    antiLinks: 'default',
    antiCaps: 'default',
    badwords: 'default',
    antiMassmention: 'default',
    mentionSpam: 'default',
    antiPolls: 'default',
    antiRaid: 'raid',
    antiAlts: 'member',
};
module.exports = {
    MODULES,
    ACTION_CHOICES,
    MODULE_ACTION_TYPE,
    buildMainPanel,
    buildModulePanel,
    buildMainRows,
    buildModuleRows,
    buildActionSelect,
};
const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} = require('discord.js');

// modal for each module's numeric settings
const MODULE_MODALS = {

    antiSpam: (current) => new ModalBuilder()
        .setCustomId('automod_modal_antiSpam')
        .setTitle('⚙️ Configure Anti-Spam')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('threshold')
                    .setLabel('Message Threshold (how many msgs to trigger)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.threshold ?? 5))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('interval')
                    .setLabel('Interval in seconds (time window)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.interval ?? 5))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('muteDuration')
                    .setLabel('Mute Duration in seconds (if action = mute)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.muteDuration ?? 60))
                    .setRequired(true)
            ),
        ),

    antiLinks: (current) => new ModalBuilder()
        .setCustomId('automod_modal_antiLinks')
        .setTitle('⚙️ Configure Anti-Links')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('blockInvites')
                    .setLabel('Block Discord Invites? (true/false)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.blockInvites ?? true))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('blockExternal')
                    .setLabel('Block External Links? (true/false)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.blockExternal ?? false))
                    .setRequired(true)
            ),
        ),

    antiCaps: (current) => new ModalBuilder()
        .setCustomId('automod_modal_antiCaps')
        .setTitle('⚙️ Configure Anti-Caps')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('percentage')
                    .setLabel('Caps Percentage to trigger (e.g. 70)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.percentage ?? 70))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('minLength')
                    .setLabel('Min message length to check (e.g. 10)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.minLength ?? 10))
                    .setRequired(true)
            ),
        ),

    badwords: (current) => new ModalBuilder()
        .setCustomId('automod_modal_badwords')
        .setTitle('⚙️ Configure Badwords Filter')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('words')
                    .setLabel('Words (comma separated e.g. word1, word2)')
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(current.words?.join(', ') ?? '')
                    .setRequired(false)
                    .setPlaceholder('word1, word2, word3...')
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('matchType')
                    .setLabel('Match Type: "full" or "partial"')
                    .setStyle(TextInputStyle.Short)
                    .setValue(current.matchType ?? 'full')
                    .setRequired(true)
                    .setPlaceholder('full or partial')
            ),
        ),

    antiMassmention: (current) => new ModalBuilder()
        .setCustomId('automod_modal_antiMassmention')
        .setTitle('⚙️ Configure Anti-MassMention')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('threshold')
                    .setLabel('Mention Threshold per message (e.g. 5)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.threshold ?? 5))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('muteDuration')
                    .setLabel('Mute Duration in seconds (if action = mute)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.muteDuration ?? 300))
                    .setRequired(true)
            ),
        ),

    mentionSpam: (current) => new ModalBuilder()
        .setCustomId('automod_modal_mentionSpam')
        .setTitle('⚙️ Configure Mention Spam')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('threshold')
                    .setLabel('Total mentions to trigger (e.g. 10)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.threshold ?? 10))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('interval')
                    .setLabel('Time window in seconds (e.g. 10)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.interval ?? 10))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('muteDuration')
                    .setLabel('Mute Duration in seconds (if action = mute)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.muteDuration ?? 600))
                    .setRequired(true)
            ),
        ),

    antiPolls: (current) => new ModalBuilder()
        .setCustomId('automod_modal_antiPolls')
        .setTitle('⚙️ Configure Anti-Polls')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('channels')
                    .setLabel('Channel IDs (comma separated, empty = all)')
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(current.channels?.join(', ') ?? '')
                    .setRequired(false)
                    .setPlaceholder('Leave empty to block polls everywhere')
            ),
        ),

    antiRaid: (current) => new ModalBuilder()
        .setCustomId('automod_modal_antiRaid')
        .setTitle('⚙️ Configure Anti-Raid')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('threshold')
                    .setLabel('Join threshold to trigger (e.g. 10)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.threshold ?? 10))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('interval')
                    .setLabel('Time window in seconds (e.g. 10)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.interval ?? 10))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('lockDuration')
                    .setLabel('Lock duration in seconds (e.g. 300)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.lockDuration ?? 300))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('options')
                    .setLabel('Lock channels? Raise verification? (true/false,true/false)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(`${current.lockChannels ?? true},${current.raiseVerification ?? false}`)
                    .setRequired(true)
                    .setPlaceholder('e.g. true,false')
            ),
        ),

    antiAlts: (current) => new ModalBuilder()
        .setCustomId('automod_modal_antiAlts')
        .setTitle('⚙️ Configure Anti-Alts')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('minAge')
                    .setLabel('Minimum account age in days (e.g. 7)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.minAge ?? 7))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('logNewJoins')
                    .setLabel('Log all new joins? (true/false)')
                    .setStyle(TextInputStyle.Short)
                    .setValue(String(current.logNewJoins ?? true))
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Kick/Ban reason')
                    .setStyle(TextInputStyle.Short)
                    .setValue(current.reason ?? 'Account too new')
                    .setRequired(true)
            ),
        ),

};

// modal for bypass roles
const bypassModal = () => new ModalBuilder()
    .setCustomId('automod_modal_bypass')
    .setTitle('🛡️ Bypass Roles')
    .addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('roleIds')
                .setLabel('Role IDs (comma separated)')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder('Right click a role → Copy ID, paste here comma separated')
        ),
    );

// modal for ignored channels
const ignoreModal = () => new ModalBuilder()
    .setCustomId('automod_modal_ignore')
    .setTitle('🔇 Ignored Channels')
    .addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('channelIds')
                .setLabel('Channel IDs (comma separated)')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder('Right click a channel → Copy ID, paste here comma separated')
        ),
    );

// modal for log channel
const logChannelModal = () => new ModalBuilder()
    .setCustomId('automod_modal_logchannel')
    .setTitle('📋 Log Channel')
    .addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('channelId')
                .setLabel('Channel ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder('Right click a channel → Copy ID')
        ),
    );

module.exports = {
    MODULE_MODALS,
    bypassModal,
    ignoreModal,
    logChannelModal,
};
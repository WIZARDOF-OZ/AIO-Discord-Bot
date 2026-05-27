const mongoose = require('mongoose');

const automodSchema = new mongoose.Schema({
    guildId: { type: String, required: true },

    // global settings
    enabled: { type: Boolean, default: false },
    bypassRoles: { type: [String], default: [] },
    ignoredChannels: { type: [String], default: [] },
    logChannel: { type: String, default: null },

    // anti spam
    antiSpam: {
        enabled: { type: Boolean, default: false },
        threshold: { type: Number, default: 5 }, // messages
        interval: { type: Number, default: 5 }, // seconds
        action: {
            type: String, default: 'delete', enum: [
                'delete',
                'warn',
                'mute',
                'delete+warn',
                'delete+mute',
                'warn+mute',
                'delete+warn+mute',
            ]
        },
        muteDuration: { type: Number, default: 60 }, // seconds
    },

    // anti links
    antiLinks: {
        enabled: { type: Boolean, default: false },
        blockInvites: { type: Boolean, default: true },
        blockExternal: { type: Boolean, default: false },
        action: {
            type: String, default: 'delete', enum: [
                'delete',
                'warn',
                'mute',
                'delete+warn',
                'delete+mute',
                'warn+mute',
                'delete+warn+mute',
            ]
        },
    },

    // anti caps
    antiCaps: {
        enabled: { type: Boolean, default: false },
        percentage: { type: Number, default: 70 }, // % of caps
        minLength: { type: Number, default: 10 }, // min message length to check
        action: {
            type: String, default: 'delete', enum: [
                'delete',
                'warn',
                'mute',
                'delete+warn',
                'delete+mute',
                'warn+mute',
                'delete+warn+mute',
            ]
        },
    },

    // anti mass mention
    antiMassmention: {
        enabled: { type: Boolean, default: false },
        threshold: { type: Number, default: 5 }, // mentions per message
        action: {
            type: String, default: 'delete', enum: [
                'delete',
                'warn',
                'mute',
                'delete+warn',
                'delete+mute',
                'warn+mute',
                'delete+warn+mute',
            ]
        },
        muteDuration: { type: Number, default: 300 }, // seconds
    },

    // mention spam (across multiple messages)
    mentionSpam: {
        enabled: { type: Boolean, default: false },
        threshold: { type: Number, default: 10 }, // total mentions in interval
        interval: { type: Number, default: 10 }, // seconds
        action: {
            type: String, default: 'delete+mute', enum: [
                'delete',
                'warn',
                'mute',
                'delete+warn',
                'delete+mute',
                'warn+mute',
                'delete+warn+mute',
            ]
        },
        muteDuration: { type: Number, default: 600 },
    },

    // badwords
    badwords: {
        enabled: { type: Boolean, default: false },
        words: { type: [String], default: [] },
        matchType: { type: String, default: 'full', enum: ['full', 'partial'] },
        action: {
            type: String, default: 'delete', enum: [
                'delete',
                'warn',
                'mute',
                'delete+warn',
                'delete+mute',
                'warn+mute',
                'delete+warn+mute',
            ]
        },
    },

    // anti polls
    antiPolls: {
        enabled: { type: Boolean, default: false },
        channels: { type: [String], default: [] }, // specific channels, empty = all
        action: {
            type: String, default: 'delete', enum: [
                'delete',
                'warn',
                'delete+warn',
            ]
        },
    },

    // anti raid
    antiRaid: {
        enabled: { type: Boolean, default: false },
        threshold: { type: Number, default: 10 }, // joins
        interval: { type: Number, default: 10 }, // seconds
        action: {
            type: String, default: 'kick', enum: [
                'kick',
                'ban',
            ]
        },
        lockChannels: { type: Boolean, default: true },
        raiseVerification: { type: Boolean, default: false }, // option C
        lockDuration: { type: Number, default: 300 }, // seconds
    },

    // anti alts
    antiAlts: {
        enabled: { type: Boolean, default: false },
        minAge: { type: Number, default: 7 }, // days
        action: { type: String, default: 'kick', enum: ['kick', 'ban', 'kick+ban'] },
        logNewJoins: { type: Boolean, default: true },
    },
});

// index for fast guild lookup
automodSchema.index({ guildId: 1 });

module.exports = mongoose.models.AutomodSettings || mongoose.model('AutomodSettings', automodSchema);
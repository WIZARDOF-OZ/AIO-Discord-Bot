const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    warnings: [
        {
            moderatorId: { type: String, required: true },
            reason: { type: String, default: 'No reason provided' },
            createdAt: { type: Date, default: Date.now },
        }
    ],
});

// index for faster queries
warningSchema.index({ guildId: 1, userId: 1 });

module.exports = mongoose.models.Warning || mongoose.model('Warning', warningSchema);
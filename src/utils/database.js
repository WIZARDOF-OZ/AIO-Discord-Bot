const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[Database] Connected to MongoDB');
    } catch (err) {
        console.error('[Database] Connection failed:', err);
        process.exit(1);
    }
};
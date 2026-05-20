const fs = require('fs');
const path = require('node:path');

module.exports = (aio) => {
    const eventsPath = path.join(__dirname, '../events');

    for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
        const event = require(path.join(eventsPath, file));

        if (!event.name) {
            console.warn(`[EVENT WARN] Missing "name" in ${file}`);
            continue;
        }

        if (event.once) {
            aio.once(event.name, (...args) => event.execute(...args, aio));
        } else {
            aio.on(event.name, (...args) => event.execute(...args, aio));
        }
    }

    console.log(`[Handler] Loaded ${fs.readdirSync(eventsPath).filter(f => f.endsWith('.js')).length} event(s)`);
};
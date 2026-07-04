const fs = require('fs');
const path = require('node:path');


module.exports = (aio) => {

    // Slash commands 
    const commandsPath = path.join(__dirname, '../commands');

    for (const folder of fs.readdirSync(commandsPath)) {
        const folderPath = path.join(commandsPath, folder);
        if (!fs.statSync(folderPath).isDirectory()) {continue;}

        for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
            const command = require(path.join(folderPath, file));

            if ('data' in command && 'execute' in command) {
                aio.commands.set(command.data.name, command);
            } else {
                console.warn(`[CMD WARN] Missing "data" or "execute" in ${file}`);
            }
        }
    }
    console.log(` [Handler] Loaded ${aio.commands.size} slash commands.`);

    // Prefix commands
    const prefixPath = path.join(__dirname, '../prefix_cmds');

    for (const folder of fs.readdirSync(prefixPath)) {
        const folderPath = path.join(prefixPath, folder);
        if (!fs.statSync(folderPath).isDirectory()) {continue;}

        for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
            const command = require(path.join(folderPath, file));

            if (command.name) {
                aio.prefix_cmds.set(command.name, command);
            } else {
                console.warn(`[PREFIX WARN] Missing "name" in ${file}`);
            }
        }
    }

    console.log(`[Handler] Loaded ${aio.prefix_cmds.size} prefix command(s)`);
}
const { Events, Message } = require('discord.js');
const { prefix } = require('../config.js');
module.exports = {
    name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     */
    async execute(message) {
        if (message.author.bot) return;
        if (message.content.startsWith(prefix)) {

            const arg = message.content.slice(prefix.length).trim().split(/ +/);//command args args args

            const command = arg.shift().toLowerCase();
            //command= 0th index element, in above case "array";
            switch (command) {
                case 'hey':
                    message.reply('Heya!');
                    break;
                case 'simp':
                    message.reply('I know you simp for me :3');
                    break;
                case 'hmm':
                    message.reply('hmmmmmmm!');
                    break;
                case 'userinfo':
                    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
                    break;
                case 'smash':
                    message.reply('what u saying????');
                    break;
                case 'ok':
                    message.reply('ok');
            }

        }
    },
};
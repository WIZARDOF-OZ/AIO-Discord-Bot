const { Events, Message } = require('discord.js');

// const { yoimiya } = require('../../src/yoimiya')
const { prefix } = require('../config.js')
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
                // case 'summon protham':
                //     message.channel.send('KEEP UR EYES PEELED,THE ATMOSPHERE IS GONNA CHANGE,PROTHAM HAS APPEARED');
                //     break
                case 'hmm':
                    message.reply('hmmmmmmm!')
                    break;
                case 'userinfo':
                    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
                    break;
                case 'smash':
                    message.reply('what u saying????')
                case 'ok':
                    message.er
            }

        }
        else if (message.content.startsWith('yuri')) {
            const msg = message.content.slice(5);
            if (!msg) return;
            message.delete().catch(err => console.log(err));
            message.channel.send(msg).catch(err => console.log(err));
        }
        else if (message.content.toLocaleLowerCase().includes("akarui")) {
            try {
                message.channel.send('**u hear a sound from no where saying:** \n **even if im not here,  fireworks gonna light ur path**\n ||<@1043111564582060052>||')
            } catch (err) {
                console.log(err)
            }
        }
        else if (message.content.toLocaleLowerCase().startsWith('summon protham'))
            message.channel.send('Keep YOUR eyes straight, the atmosphere is changing ,it means he entered the domain, welcome - <@535077495876091904>');
    }
};
const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    execute(aio) {

        console.log(`Im Online YAYAY ${aio.user.tag}`);


        aio.user.setStatus('idle');
        aio.user.setActivity(`Under Developement`, ActivityType.Watching)
        // const channel = yoimiya.channels.cache.get('1119346920058531931');
        // channel.send('<@952975852801523762> <@583666642010112000> Yoimiya is online');

    },
};
const { ActivityType, Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(aio, readyClient) {

        console.log(`Im Online YAYAY ${readyClient.user.tag}`);


        aio.user.setStatus('idle');
        aio.user.setActivity(`Under Developement`, { type: ActivityType.Watching });
        // const channel = yoimiya.channels.cache.get('1119346920058531931');
        // channel.send('<@952975852801523762> <@583666642010112000> Yoimiya is online');

    },
};
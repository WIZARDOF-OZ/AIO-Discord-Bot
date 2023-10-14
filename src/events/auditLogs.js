// const { Events, GuildAuditLogs } = require('discord.js');
// const aio = require('../index.js');

// module.exports = {
//     name: Events.GuildAuditLogEntryCreate,
//     on: true,
//     /**
//      *
//      * @param {GuildAuditLogs} auditLog
//      */
//     async execute(auditLog) {
//         console.log(auditLog);
//         const g = await aio.guilds.fetch("810199045036441681");
//         const channel = await g.channels.fetch("860060454407766036");
//         channel.send("GGs" + auditLog.actionType);

//     },
// };
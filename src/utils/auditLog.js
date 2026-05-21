const {
    AuditLogEvent
} = require("discord.js");

class AuditLogger {

    async get(
        guild,
        type,
        targetId = null
    ) {

        try {

            // Give Discord time to update audit logs
            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const fetchedLogs =
                await guild.fetchAuditLogs({

                    limit: 10,
                    type: type

                });

            let entry;

            // Find matching target
            if (targetId) {

                entry =
                    fetchedLogs.entries.find(
                        log =>
                            log.target &&
                            log.target.id ===
                            targetId
                    );

            } else {

                entry =
                    fetchedLogs.entries.first();

            }

            if (!entry) {

                return {

                    executor: null,
                    reason:
                        "No reason provided"

                };

            }

            return {

                executor:
                    entry.executor || null,

                reason:
                    entry.reason ||
                    "No reason provided"

            };

        }

        catch (err) {

            console.error(
                "[AuditLog Utility]",
                err
            );

            return {

                executor: null,
                reason:
                    "No reason provided"

            };

        }

    }

}

module.exports =
    new AuditLogger();
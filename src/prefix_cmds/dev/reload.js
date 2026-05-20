module.exports = {
    name: "reload",
    ownerOnly: true,

    async execute(aio, message, args) {

        const commandName = args[0];

        if (!commandName) {
            return message.reply(
                "Provide a command name."
            );
        }

        const command =
            aio.prefix_cmds.get(commandName);

        if (!command) {

            return message.reply(
                "Command not found."
            );
        }

        delete require.cache[
            require.resolve(command.path)
        ];

        try {

            const newCommand =
                require(command.path);

            aio.prefix_cmds.set(
                newCommand.name,
                newCommand
            );

            return message.reply(
                `Reloaded ${commandName}`
            );

        } catch (err) {

            console.log(err);

            return message.reply(
                `Reload failed`
            );
        }

    }
};
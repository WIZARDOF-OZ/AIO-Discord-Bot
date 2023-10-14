const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Wanna see your avatar?')
        .addUserOption(op => op.setName('member').setDescription("any specific person's pfp you want to see?"))
        .addBooleanOption(bo => bo.setName("guild_avatar").setDescription("Choose true if you want to see your server pfp, otherwise skip this option")),
    category: 'utility',
    async execute(interaction) {
        const bool = interaction.options.getBoolean('guild_avatar');
        // code to be written
        const member = interaction.options.getMember('member') ?? interaction;

        const av = member.user.displayAvatarURL({ size: 4096, format: 'png', dynamic: true });


        const display = (a) => {
            const avatar = new EmbedBuilder()
                .setColor(0xfa9e48)
                .setAuthor({
                    name: member.user.username, iconURL: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`
                })
                .setImage(a)
            interaction.reply({ embeds: [avatar] })
        }
        if (bool) {
            try {
                const av = member.member.displayAvatarURL({ size: 4096, format: 'png', dynamic: true });
                return display(av)
            } catch (err) {
                // console.log(err)
                return interaction.reply('You dont have separate server pfp .-.')
            }
        }
        display(av)

    }
}
const { EmbedBuilder } = require("discord.js");
const { prefix } = require("../../config");
module.exports = {

    name: "8ball",
    aliases: ["8b"],
    description: "There is a big chance I insult you!",
    usage: '<question>',
    args: true,
    cooldown: 3,
    category: "fun",

    async execute(aio, message, args) {
        const question = args.join(" ");


        const responses = [
            'Maybe.',
            'Certainly not.',
            'I hope so.',
            'Not in your wildest dreams.',
            'There is a good chance.',
            'Quite likely.',
            'I think so.',
            'I hope not.',
            'I hope so.',
            'Never!',
            'Fuhgeddaboudit.',
            'Ahaha! Really?!?',
            'Pfft.',
            'Sorry, bucko.',
            'Hell, yes.',
            'Hell to the no.',
            'The future is bleak.',
            'The future is uncertain.',
            'I would rather not say.',
            'Who cares?',
            'Possibly.',
            'Never, ever, ever.',
            'There is a small chance.',
            'Yes!'
        ];
        const response =
            responses[Math.floor(Math.random() * responses.length)];
        const Embed = new EmbedBuilder()
            .setTitle('🎱 Magic 8Ball')
            .addFields(
                {
                    name: '❓Question',
                    value: question,
                },
                {
                    name: '🎱 Answer',
                    value: response,
                }
            )
            .setColor(`DarkVividPink`);
        message.reply({ embeds: [Embed] });

    },
};
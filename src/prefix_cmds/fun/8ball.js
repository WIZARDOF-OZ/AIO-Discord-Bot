const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
module.exports = {

    name: "8ball",
    aliases: [" "],
    description: "There is a big chance I insult you!",
    category: "fun",
    usage: "8ball",

    async execute(message) {
        let question = message.content.slice(config.prefix + 6);
        if (!question)
            message.channel.send(`You did not specify your question!`);
        else {
            let responses = [
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
            let response =
                responses[Math.floor(Math.random() * responses.length - 1)];
            let Embed = new EmbedBuilder()
                .setTitle('8Ball!')
                .setDescription(`Your question: ${question}\nMy reply: ${response}`)
                .setColor(`DarkVividPink`);
            message.channel.send({ embeds: [Embed] });
        }
    },
};
const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profilepic")
    .setDescription("Shows the avatar of a user")
    .addUserOption(option =>
      option.setName("user").setDescription("Select a user")
    ),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    let user = interaction.options.getUser("user");

    if (!user) {
      user = interaction.user;
    }

    const avatarEmbed = new EmbedBuilder()
      .setColor("#0155b6")
      .setTitle(`**${user.username}**\'s Avatar`)
      .setImage(
        `${user.displayAvatarURL({
          size: 4096,
        })}`
      );

    const avatarRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Avatar Link")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `${user.avatarURL({
            size: 4096,
          })}`
        )
    );

    await interaction.reply({
      embeds: [avatarEmbed],
      components: [avatarRow],
    });
  },
};
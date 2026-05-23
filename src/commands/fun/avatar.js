const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to get the avatar of')
      .setRequired(false))
    .addBooleanOption(option => option
      .setName('server_avatar')
      .setDescription('Show server avatar instead of global avatar')
      .setRequired(false)),
  category: 'fun',

  async execute(interaction) {
    const target = interaction.options.getMember('user') ?? interaction.member;
    const serverAvatar = interaction.options.getBoolean('server_avatar') ?? false;

    const user = target.user;
    const avatar = serverAvatar
      ? target.displayAvatarURL({ size: 4096, extension: 'png', forceStatic: false })
      : user.displayAvatarURL({ size: 4096, extension: 'png', forceStatic: false });

    // fallback to global if no server avatar
    if (serverAvatar && avatar === user.displayAvatarURL()) {
      return interaction.reply({
        content: '❌ This user has no separate server avatar.',
        flags: MessageFlags.Ephemeral
      });
    }

    const avatarURL = user.avatarURL({ size: 4096 }) ?? user.defaultAvatarURL;

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${user.username}'s ${serverAvatar ? 'Server' : 'Global'} Avatar`)
      .setImage(avatar)
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Download Avatar')
        .setStyle(ButtonStyle.Link)
        .setURL(avatarURL),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
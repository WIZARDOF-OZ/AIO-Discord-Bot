const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    SectionBuilder,
    ThumbnailBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
} = require('discord.js');

// category emojis
const categoryEmojis = {
    mod: '🔨',
    info: 'ℹ️',
    fun: '🎉',
    nsfw: '🔞',
    utility: '🔧',
    owner: '👑',
    economy: '💰',
    anime: '🌸',
    administration: '⚙️',
    other: '📦',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands')
        .addStringOption(option => option
            .setName('command')
            .setDescription('Get info about a specific command')
            .setRequired(false))
        .setDMPermission(false),
    category: 'info',

    async execute(interaction) {
        const { client } = interaction;
        const commandName = interaction.options.getString('command');

        // specific command info
        if (commandName) {
            const command = client.commands.get(commandName);

            if (!command) {
                return interaction.reply({
                    content: `❌ No command found with name \`${commandName}\`.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const container = new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`## 📖 /${command.data.name}`),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        [
                            `📝 **Description:** ${command.data.description}`,
                            `📁 **Category:** ${command.category ?? 'Other'}`,
                            `⏱️ **Cooldown:** ${command.cooldown ? `${command.cooldown}s` : 'None'}`,
                        ].join('\n')
                    ),
                );

            return interaction.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        // group commands by category
        const categories = {};
        for (const command of client.commands.values()) {
            const category = command.category ?? 'other';
            if (!categories[category]) {categories[category] = [];}
            categories[category].push(command);
        }

        // build main container
        const container = new ContainerBuilder()
            // header section with bot avatar
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`## ${client.user.username} Help`),
                        new TextDisplayBuilder().setContent(
                            `Use the dropdown below to browse commands by category.\nOr use \`/help command:<name>\` for info on a specific command.\n\n📊 **Total Commands:** ${client.commands.size}`
                        ),
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder().setURL(client.user.displayAvatarURL()),
                    )
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small),
            );

        // add each category as a text block
        for (const [category, cmds] of Object.entries(categories)) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `${categoryEmojis[category] ?? '📦'} **${category.charAt(0).toUpperCase() + category.slice(1)}** [${cmds.length}]\n${cmds.map(c => `\`/${c.data.name}\``).join(', ')}`
                ),
            );
            container.addSeparatorComponents(
                new SeparatorBuilder().setDivider(false).setSpacing(SeparatorSpacingSize.Small),
            );
        }

        // dropdown for categories
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category')
            .setPlaceholder('Browse a category...')
            .addOptions(
                Object.entries(categories).map(([category, cmds]) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${category.charAt(0).toUpperCase() + category.slice(1)} (${cmds.length})`)
                        .setDescription(`Browse ${cmds.length} command(s)`)
                        .setValue(category)
                        .setEmoji(categoryEmojis[category] ?? '📦')
                )
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const reply = await interaction.reply({
            components: [container, row],
            flags: MessageFlags.IsComponentsV2,
            withResponse: true,
        });

        // handle dropdown selection
        const message = reply.resource.message;
        const collector = message.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 60_000,
        });

        collector.on('collect', async i => {
            const selected = i.values[0];
            const cmds = categories[selected];

            const categoryContainer = new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `## ${categoryEmojis[selected] ?? '📦'} ${selected.charAt(0).toUpperCase() + selected.slice(1)} Commands`
                    ),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        cmds.map(c => `**\`/${c.data.name}\`** — ${c.data.description}`).join('\n')
                    ),
                );

            await i.update({
                components: [categoryContainer, row],
                flags: MessageFlags.IsComponentsV2,
            });
        });

        collector.on('end', async () => {
            selectMenu.setDisabled(true);
            const disabledRow = new ActionRowBuilder().addComponents(selectMenu);
            await message.edit({
                components: [container, disabledRow],
                flags: MessageFlags.IsComponentsV2,
            }).catch(() => null);
        });
    },
};
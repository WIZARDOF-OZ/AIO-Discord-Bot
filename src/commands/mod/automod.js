const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} = require('discord.js');

const AutomodSettings = require('../../models/AutomodSettings.js');
const { invalidateCache } = require('../../automod/index.js');
const {
    buildMainPanel,
    buildModulePanel,
    buildMainRows,
    buildModuleRows,
    buildActionSelect,
} = require('../../automod/panelUtils.js');
const {
    MODULE_MODALS,
    bypassModal,
    ignoreModal,
    logChannelModal,
} = require('../../automod/panelModals.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Open the AutoMod control panel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    category: 'mod',

    async execute(interaction) {
        const guild = interaction.guild;

        // get or create settings
        let settings = await AutomodSettings.findOne({ guildId: guild.id });
        if (!settings) {
            settings = new AutomodSettings({ guildId: guild.id });
            await settings.save();
        }

        const container = buildMainPanel(settings, guild);
        const rows = buildMainRows(settings);

        // send public panel
        const reply = await interaction.reply({
            components: [container, ...rows],
            flags: MessageFlags.IsComponentsV2,
            withResponse: true,
        });

        const message = reply.resource.message;
        const collector = message.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 5 * 60 * 1000, // 5 minutes
        });

        // also collect modals
        const modalFilter = i => i.user.id === interaction.user.id && i.isModalSubmit();

        collector.on('collect', async i => {
            const id = i.customId;

            // refresh settings on every interaction
            settings = await AutomodSettings.findOne({ guildId: guild.id });

            // enable/disable system
            if (id === 'automod_enable') {
                settings.enabled = true;
                await settings.save();
                invalidateCache(guild.id);
                const updated = buildMainPanel(settings, guild);
                const updatedRows = buildMainRows(settings);
                return i.update({ components: [updated, ...updatedRows], flags: MessageFlags.IsComponentsV2 });
            }

            if (id === 'automod_disable') {
                settings.enabled = false;
                await settings.save();
                invalidateCache(guild.id);
                const updated = buildMainPanel(settings, guild);
                const updatedRows = buildMainRows(settings);
                return i.update({ components: [updated, ...updatedRows], flags: MessageFlags.IsComponentsV2 });
            }

            // log channel button
            if (id === 'automod_logchannel') {
                return i.showModal(logChannelModal());
            }

            // bypass roles button
            if (id === 'automod_bypass') {
                return i.showModal(bypassModal());
            }

            // ignore channels button
            if (id === 'automod_ignore') {
                return i.showModal(ignoreModal());
            }

            // module selected from dropdown
            if (id === 'automod_module_select') {
                const moduleKey = i.values[0];
                const container = buildModulePanel(moduleKey, settings, guild);
                const rows = buildModuleRows(moduleKey);
                return i.update({ components: [container, ...rows], flags: MessageFlags.IsComponentsV2 });
            }

            // back to main panel
            if (id === 'automod_back') {
                const container = buildMainPanel(settings, guild);
                const rows = buildMainRows(settings);
                return i.update({ components: [container, ...rows], flags: MessageFlags.IsComponentsV2 });
            }

            // module enable
            if (id.startsWith('automod_mod_enable_')) {
                const moduleKey = id.replace('automod_mod_enable_', '');
                settings[moduleKey].enabled = true;
                await settings.save();
                invalidateCache(guild.id);
                const container = buildModulePanel(moduleKey, settings, guild);
                const rows = buildModuleRows(moduleKey);
                return i.update({ components: [container, ...rows], flags: MessageFlags.IsComponentsV2 });
            }

            // module disable
            if (id.startsWith('automod_mod_disable_')) {
                const moduleKey = id.replace('automod_mod_disable_', '');
                settings[moduleKey].enabled = false;
                await settings.save();
                invalidateCache(guild.id);
                const container = buildModulePanel(moduleKey, settings, guild);
                const rows = buildModuleRows(moduleKey);
                return i.update({ components: [container, ...rows], flags: MessageFlags.IsComponentsV2 });
            }

            // module configure — show action select first
            if (id.startsWith('automod_mod_configure_')) {
                const moduleKey = id.replace('automod_mod_configure_', '');
                const actionRows = buildActionSelect(moduleKey);

                // show action select ephemerally
                return i.reply({
                    content: '## ⚡ Step 1: Select an Action\nChoose what AutoMod should do when this rule triggers, then the settings modal will open.',
                    components: actionRows,
                    flags: MessageFlags.Ephemeral,
                });
            }




        });

        // handle modal submissions separately
        const modalCollector = message.channel.createMessageCollector({
            filter: m => false, // we only want interactions
            time: 5 * 60 * 1000,
        });

        // listen for modal submits on the client
        const interactionListerner = async (i) => {
            if (i.user.id !== interaction.user.id) return;
            if (!i.guild || i.guild.id !== guild.id) return;

            const id = i.customId;

            // handle select menu and buttons first — no defer needed
            if (i.isStringSelectMenu() && id.startsWith('automod_action_select_')) {
                const moduleKey = id.replace('automod_action_select_', '');
                const selectedAction = i.values[0];

                // fetch settings here since we need modData
                const currentSettings = await AutomodSettings.findOne({ guildId: guild.id });
                const modData = currentSettings[moduleKey];

                const modal = MODULE_MODALS[moduleKey](modData);
                modal.setCustomId(`automod_modal_${moduleKey}_${selectedAction}`);
                return i.showModal(modal);
            }

            if (i.isButton() && id.startsWith('automod_mod_back_')) {
                const moduleKey = id.replace('automod_mod_back_', '');
                const currentSettings = await AutomodSettings.findOne({ guildId: guild.id });
                const container = buildModulePanel(moduleKey, currentSettings, guild);
                const rows = buildModuleRows(moduleKey);
                return i.update({
                    content: null,
                    components: [container, ...rows],
                    flags: MessageFlags.IsComponentsV2,
                }).catch(() => null);
            }

            if (!i.isModalSubmit()) return;

            // defer IMMEDIATELY before any async operations
            await i.deferReply({ flags: MessageFlags.Ephemeral });

            // NOW fetch settings after deferring
            settings = await AutomodSettings.findOne({ guildId: guild.id });

            // log channel modal
            if (id === 'automod_modal_logchannel') {
                const channelId = i.fields.getTextInputValue('channelId').trim();
                const channel = guild.channels.cache.get(channelId);

                if (!channel) {
                    return i.editReply({ content: '❌ Invalid channel ID.' });
                }

                settings.logChannel = channelId;
                await settings.save();
                invalidateCache(guild.id);

                await i.editReply({ content: `✅ Log channel set to ${channel}.` });

                const updated = buildMainPanel(settings, guild);
                const updatedRows = buildMainRows(settings);
                await message.edit({ components: [updated, ...updatedRows], flags: MessageFlags.IsComponentsV2 }).catch(() => null);
                return;
            }

            // bypass modal
            if (id === 'automod_modal_bypass') {
                const raw = i.fields.getTextInputValue('roleIds');
                const roles = raw.split(',').map(r => r.trim()).filter(Boolean);

                settings.bypassRoles = roles;
                await settings.save();
                invalidateCache(guild.id);

                await i.editReply({ content: `✅ Bypass roles updated. ${roles.length} role(s) set.` });

                const updated = buildMainPanel(settings, guild);
                const updatedRows = buildMainRows(settings);
                await message.edit({ components: [updated, ...updatedRows], flags: MessageFlags.IsComponentsV2 }).catch(() => null);
                return;
            }

            // ignore channels modal
            if (id === 'automod_modal_ignore') {
                const raw = i.fields.getTextInputValue('channelIds');
                const channels = raw.split(',').map(c => c.trim()).filter(Boolean);

                settings.ignoredChannels = channels;
                await settings.save();
                invalidateCache(guild.id);

                await i.editReply({ content: `✅ Ignored channels updated. ${channels.length} channel(s) set.` });

                const updated = buildMainPanel(settings, guild);
                const updatedRows = buildMainRows(settings);
                await message.edit({ components: [updated, ...updatedRows], flags: MessageFlags.IsComponentsV2 }).catch(() => null);
                return;
            }

            // module modals
            if (id.startsWith('automod_modal_')) {
                const parts = id.replace('automod_modal_', '').split('_');
                const action = parts.pop();
                const moduleKey = parts.join('_');

                if (!settings[moduleKey]) return i.editReply({ content: '❌ Unknown module.' });

                settings[moduleKey].action = action;

                try {
                    switch (moduleKey) {
                        case 'antiSpam':
                            settings.antiSpam.threshold = parseInt(i.fields.getTextInputValue('threshold'));
                            settings.antiSpam.interval = parseInt(i.fields.getTextInputValue('interval'));
                            settings.antiSpam.muteDuration = parseInt(i.fields.getTextInputValue('muteDuration'));
                            break;

                        case 'antiLinks':
                            settings.antiLinks.blockInvites = i.fields.getTextInputValue('blockInvites').trim().toLowerCase() === 'true';
                            settings.antiLinks.blockExternal = i.fields.getTextInputValue('blockExternal').trim().toLowerCase() === 'true';
                            break;

                        case 'antiCaps':
                            settings.antiCaps.percentage = parseInt(i.fields.getTextInputValue('percentage'));
                            settings.antiCaps.minLength = parseInt(i.fields.getTextInputValue('minLength'));
                            break;

                        case 'badwords': {
                            const raw = i.fields.getTextInputValue('words');
                            const matchType = i.fields.getTextInputValue('matchType').trim().toLowerCase();
                            settings.badwords.words = raw.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
                            settings.badwords.matchType = matchType === 'partial' ? 'partial' : 'full';
                            break;
                        }

                        case 'antiMassmention':
                            settings.antiMassmention.threshold = parseInt(i.fields.getTextInputValue('threshold'));
                            settings.antiMassmention.muteDuration = parseInt(i.fields.getTextInputValue('muteDuration'));
                            break;

                        case 'mentionSpam':
                            settings.mentionSpam.threshold = parseInt(i.fields.getTextInputValue('threshold'));
                            settings.mentionSpam.interval = parseInt(i.fields.getTextInputValue('interval'));
                            settings.mentionSpam.muteDuration = parseInt(i.fields.getTextInputValue('muteDuration'));
                            break;

                        case 'antiPolls': {
                            const raw = i.fields.getTextInputValue('channels');
                            settings.antiPolls.channels = raw.split(',').map(c => c.trim()).filter(Boolean);
                            break;
                        }

                        case 'antiRaid': {
                            settings.antiRaid.threshold = parseInt(i.fields.getTextInputValue('threshold'));
                            settings.antiRaid.interval = parseInt(i.fields.getTextInputValue('interval'));
                            settings.antiRaid.lockDuration = parseInt(i.fields.getTextInputValue('lockDuration'));
                            const [lock, verify] = i.fields.getTextInputValue('options').split(',');
                            settings.antiRaid.lockChannels = lock?.trim().toLowerCase() === 'true';
                            settings.antiRaid.raiseVerification = verify?.trim().toLowerCase() === 'true';
                            break;
                        }

                        case 'antiAlts':
                            settings.antiAlts.minAge = parseInt(i.fields.getTextInputValue('minAge'));
                            settings.antiAlts.logNewJoins = i.fields.getTextInputValue('logNewJoins').trim().toLowerCase() === 'true';
                            break;


                    }

                    await settings.save();
                    invalidateCache(guild.id);

                    await i.editReply({ content: `✅ **${moduleKey}** settings saved successfully!` });

                    const container = buildModulePanel(moduleKey, settings, guild);
                    const rows = buildModuleRows(moduleKey);
                    await message.edit({ components: [container, ...rows], flags: MessageFlags.IsComponentsV2 }).catch(() => null);

                } catch (err) {
                    console.error(`[AutoMod Panel] Modal parse error:`, err);
                    await i.editReply({ content: '❌ Invalid values provided. Please check your inputs and try again.' });
                }
            }
        };

        // attach modal listener
        interaction.client.on('interactionCreate', interactionListerner);

        // cleanup on collector end
        collector.on('end', async () => {
            interaction.client.removeListener('interactionCreate', interactionListerner);

            // disable all components
            const expired = buildMainPanel(settings, guild);
            const disabledRows = buildMainRows(settings).map(row => {
                row.components.forEach(c => c.setDisabled(true));
                return row;
            });

            await message.edit({
                components: [expired, ...disabledRows],
                flags: MessageFlags.IsComponentsV2,
            }).catch(() => null);
        });
    },
};
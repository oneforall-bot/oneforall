const {MessageActionRow, MessageButton} = require("discord.js");

module.exports = {
    data: {
        name: 'antiraid',
        description: 'Get or edit the antiraid',
        options: [
            {
                name: 'sanction',
                type: "SUB_COMMAND",
                description: 'Configuration the antiraid sanction',
                options: [
                    {
                        type: "STRING",
                        required: true,
                        name: 'feature',
                        description: 'The antiraid feature to edit.',
                        choices: []
                    },
                    {
                        type: 'STRING',
                        required: true,
                        name: 'sanction',
                        description: 'The sanction to put for the feature.',
                        choices: [
                            {
                                name: 'ban',
                                value: 'ban'
                            },
                            {
                                name: 'kick',
                                value: 'kick'
                            },
                            {
                                name: 'unrank',
                                value: 'unrank'
                            },
                            {
                                name: 'mute',
                                value: 'mute'
                            },
                        ]
                    }
                ],

            },
            {
                name: 'enable',
                type: "SUB_COMMAND",
                description: 'Enable or disable the antiraid feature',
                options: [
                    {
                        type: "STRING",
                        required: true,
                        name: 'feature',
                        description: 'The antiraid feature to enable or disable.',
                        choices: [
                            {
                                name: 'all',
                                value: 'all'
                            },
                        ]
                    },
                    {
                        type: 'BOOLEAN',
                        required: true,
                        name: 'enable',
                        description: 'Decide to enable or disable the antiraid feature.'
                    }
                ],

            },
            {
                name: 'limit',
                type: "SUB_COMMAND",
                description: 'Configuration the antiraid sanction',
                options: [
                    {
                        type: "STRING",
                        required: true,
                        name: 'feature',
                        description: 'The antiraid feature to edit.',
                        choices: []
                    },
                    {
                        type: 'STRING',
                        required: true,
                        name: 'limit',
                        description: 'The limit to put for the feature.',
                    }
                ],

            },
            {
                name: 'show',
                type: 'SUB_COMMAND',
                description: 'Show the actual antiraid config'
            },
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("ANTIRAID_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return await interaction.editReply({content: lang.notEnoughPermissions('antiraid')})
        const subCommand = interaction.options.getSubcommand()
        const feature = interaction.options.get('feature')
        if (subCommand === "sanction") {
            const sanction = interaction.options.get('sanction').value
            guildData.antiraid.config[feature.value] = sanction
            guildData.save().then(() => {
                interaction.editReply({content: lang.antiraid.config.success(feature.value, sanction)})
            })
        }
        if (subCommand === 'enable') {
            const enable = interaction.options.get('enable').value
            if (feature.value !== 'all') {
                guildData.antiraid.enable[feature.value] = enable
                guildData.save().then(() => {
                    interaction.editReply({content: lang.antiraid.enable.success(feature.value, guildData.antiraid.enable[feature.value])})
                })
            } else {
                for (const feature of Object.keys(guildData.antiraid.enable)) guildData.antiraid.enable[feature] = enable
                guildData.save().then(() => {
                    interaction.editReply({content: lang.antiraid.enable.all(enable)})
                })
            }

        }
        if (subCommand === 'limit') {
            const limit = interaction.options.get('limit')
            if (feature.value === 'antiMassBan' || feature.value === 'antiMassKick' || feature.value === 'antiLink' || feature.value === 'antiToken' || feature.value === 'antiMassMention') {


                if (!oneforall.functions.isValidTime(limit.value, true)) {
                    return interaction.editReply({content: lang.antiraid.limit.errorNotNumber})
                }
            }
            if (feature.value === 'antiDc') {
                if (!oneforall.functions.isValidTime(limit.value)) {
                    return interaction.editReply({content: lang.antiraid.limit.errorAntiDc})
                }

            }
            guildData.antiraid.limit[feature.value] = limit.value

            guildData.save().then(() => {
                interaction.editReply({content: lang.antiraid.limit.success(feature.value, limit.value)})
            })
        }
        if (subCommand === "show") {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`antiraid.left.${interaction.id}`)
                        .setEmoji('◀️')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`antiraid.cancel.${interaction.id}`)
                        .setEmoji('❌')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`antiraid.right.${interaction.id}`)
                        .setEmoji('➡️')
                        .setStyle('SECONDARY')
                )
            const componentFilter = {
                filter: interactionList => interactionList.customId.includes(`antiraid`) && interactionList.customId.includes(interaction.id) && interactionList.user.id === interaction.user.id,
                time: 900000
            }
            const fields = []
            for (let i = 0; i < Object.entries(guildData.antiraid.config).length; i++) {
                const {config, enable, limit} = guildData.antiraid
                const configArray = Object.entries(config)[i]
                const enableArray = Object.entries(enable).find(feature => feature[0] === configArray[0])
                const limitArray = Object.entries(limit).find(feature => feature[0] === configArray[0])
                if(enableArray && configArray)
                    fields.push({
                        name: `${i + 1} ・ ${configArray[0]}:`,
                        value: `**Actif:** ${enableArray[1] ? '✅' : '❌'}\n**Sanction: **${configArray[1]}\n${limitArray ? `**Limit:** ${limitArray[1]}` : ''}`
                    })
            }
            let page = 0
            let slicerIndicatorMin = 0,
                slicerIndicatorMax = 10,
                maxPerPage = 10,
                totalPage = Math.ceil(Object.keys(guildData.antiraid.config).length / maxPerPage)
            const embed = {
                timestamp: new Date(),
                color: '#36393F',
                fields: fields.slice(0, maxPerPage),
                title: `Antiraid Config (${Object.keys(guildData.antiraid.config).length})`,
                footer: {
                    text: `Antiraid Config ・ Page 1/${totalPage}`,
                    icon_url: interaction.user.displayAvatarURL({dynamic: true}) || ''
                },
            }

            const embedPageChanger = (page) => {
                embed.fields = fields.slice(slicerIndicatorMin, slicerIndicatorMax)
                embed.footer.text = `Antiraid Config ・ Page ${page + 1} / ${totalPage}`
                return embed
            }
            const collector = interaction.channel.createMessageComponentCollector(componentFilter)
            collector.on('collect', async (interactionList) => {
                await interactionList.deferUpdate()
                const selectedButton = interactionList.customId.split('.')[1]
                if (selectedButton === 'left') {
                    page = page === 0 ? page = totalPage - 1 : page <= totalPage - 1 ? page -= 1 : page += 1
                    slicerIndicatorMin -= maxPerPage
                    slicerIndicatorMax -= maxPerPage
                }
                if (selectedButton === 'right') {
                    page = page !== totalPage - 1 ? page += 1 : page = 0
                    slicerIndicatorMin += maxPerPage
                    slicerIndicatorMax += maxPerPage

                }
                if (selectedButton === 'cancel') {
                    return collector.stop()
                }
                if (slicerIndicatorMax < 0 || slicerIndicatorMin < 0) {
                    slicerIndicatorMin += maxPerPage * totalPage
                    slicerIndicatorMax += maxPerPage * totalPage
                } else if ((slicerIndicatorMax >= maxPerPage * totalPage || slicerIndicatorMin >= maxPerPage * totalPage) && page === 0) {
                    slicerIndicatorMin = 0
                    slicerIndicatorMax = maxPerPage
                }
                await interaction.editReply({
                    embeds: [embedPageChanger(page)]
                })
            })
            collector.on('end', () => {
                interaction.deleteReply()
            })

            await interaction.editReply({embeds: [embed], components: [row]})

        }
    }
}

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
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("ANTIRAID_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return await message.editReply({content: lang.notEnoughPermissions('antiraid')})
        const subCommand = message.options.getSubcommand()
        const feature = message.options.get('feature')
        if (subCommand === "sanction") {
            const sanction = message.options.get('sanction').value
            guildData.antiraid.config[feature.value] = sanction
            guildData.save().then(() => {
                message.editReply({content: lang.antiraid.config.success(feature.value, sanction)})
            })
        }
        if (subCommand === 'enable') {
            const enable = message.options.get('enable').value
            if (feature.value !== 'all') {
                guildData.antiraid.enable[feature.value] = enable
                guildData.save().then(() => {
                    message.editReply({content: lang.antiraid.enable.success(feature.value, guildData.antiraid.enable[feature.value])})
                })
            } else {
                for (const feature of Object.keys(guildData.antiraid.enable)) guildData.antiraid.enable[feature] = enable
                guildData.save().then(() => {
                    message.editReply({content: lang.antiraid.enable.all(enable)})
                })
            }

        }
        if (subCommand === 'limit') {
            const limit = message.options.get('limit')
            if (feature.value === 'antiMassBan' || feature.value === 'antiMassKick' || feature.value === 'antiLink' || feature.value === 'antiToken' || feature.value === 'antiMassMention') {


                if (!oneforall.functions.isValidTime(limit.value, true)) {
                    return message.editReply({content: lang.antiraid.limit.errorNotNumber})
                }
            }
            if (feature.value === 'antiDc') {
                if (!oneforall.functions.isValidTime(limit.value)) {
                    return message.editReply({content: lang.antiraid.limit.errorAntiDc})
                }

            }
            guildData.antiraid.limit[feature.value] = limit.value

            guildData.save().then(() => {
                message.editReply({content: lang.antiraid.limit.success(feature.value, limit.value)})
            })
        }
        if (subCommand === "show") {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`antiraid.left.${message.id}`)
                        .setEmoji('◀️')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`antiraid.cancel.${message.id}`)
                        .setEmoji('❌')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`antiraid.right.${message.id}`)
                        .setEmoji('➡️')
                        .setStyle('SECONDARY')
                )
            const componentFilter = {
                filter: messageList => messageList.customId.includes(`antiraid`) && messageList.customId.includes(message.id) && messageList.user.id === message.author.id,
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
                color: guildData.embedColor,
                fields: fields.slice(0, maxPerPage),
                title: `Antiraid Config (${Object.keys(guildData.antiraid.config).length})`,
                footer: {
                    text: `Antiraid Config ・ Page 1/${totalPage}`,
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                },
            }

            const embedPageChanger = (page) => {
                embed.fields = fields.slice(slicerIndicatorMin, slicerIndicatorMax)
                embed.footer.text = `Antiraid Config ・ Page ${page + 1} / ${totalPage}`
                return embed
            }
            const collector = message.channel.createMessageComponentCollector(componentFilter)
            collector.on('collect', async (messageList) => {
                await messageList.deferUpdate()
                const selectedButton = messageList.customId.split('.')[1]
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
                await message.editReply({
                    embeds: [embedPageChanger(page)]
                })
            })
            collector.on('end', () => {
                message.deleteReply()
            })

            await message.editReply({embeds: [embed], components: [row]})

        }
    }
}

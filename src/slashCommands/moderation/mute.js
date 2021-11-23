const ms = require('ms'),
    moment = require('moment')
const {MessageActionRow, MessageButton} = require("discord.js");
module.exports = {
    data: {
        name: 'mute',
        description: 'Manage the mutes',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'add',
                description: 'Mute a member',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to mute',
                        required: true,
                    },
                    {
                        type: 'STRING',
                        name: 'reason',
                        description: 'The reason to mute',
                        required: false,
                    },
                    {
                        type: 'STRING',
                        name: 'time',
                        description: 'The time to mute the member',
                        required: false,
                    },
                ]
            },
            {
                name: 'remove',
                type: 'SUB_COMMAND',
                description: 'Unmute a member',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to unmute',
                        required: true
                    }
                ]
            },
            {
                name: 'list',
                type: 'SUB_COMMAND',
                description: 'List all the mutes members',
            },
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const {options} = interaction;
        const subCommand = options.getSubcommand()
        const member = options.getMember('member')
        const reason = options.getString('reason') || `Muted by ${interaction.user.username}#${interaction.user.discriminator}`
        const time = options.getString('time')
        const permToCheck = subCommand === 'add' && time ? 'TEMP_' : subCommand === 'remove' ? 'UN' : 'MUTE_CMD'
        const hasPermission = memberData.permissionManager.has(permToCheck)
        await interaction.deferReply({ephemeral: (!!!hasPermission)})
        const lang = guildData.langManager
        if (!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions(time ? 'tempmute' : 'mute')})
        if (!guildData.setup) return interaction.editReply({content: 'Please setup the bot with /setup'})
        const isMuted = oneforall.managers.mutesManager.has(`${interaction.guildId}-${member?.id}`)
        if (subCommand === 'add') {
            if (isMuted) return interaction.editReply({content: lang.mute.add.alreadyMuted})

            if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId && !oneforall.isOwner(interaction.user.id)) return interaction.editReply({content: lang.roleSuppThanAuthor})
            if (time && !oneforall.functions.isValidTime(time)) return interaction.editReply({content: lang.incorrectTime})
            oneforall.managers.mutesManager.getAndCreateIfNotExists(`${interaction.guildId}-${member.id}`, {
                guildId: interaction.guildId,
                memberId: member.id,
                expiredAt: time ? moment().utc().add(ms(time), 'millisecond').valueOf() : null,
                createdAt: new Date(),
                reason,
                authorId: interaction.user.id
            }).save().then(() => {
                member.roles.add(guildData.mute, reason)
                interaction.editReply({content: lang.mute.add.success(`${member.user.username}#${member.user.discriminator}`, time ? ms(time) : undefined, reason)})
            })
        }
        if (subCommand === 'remove') {
            if (!isMuted) return interaction.editReply({content: lang.mute.remove.notMuted})
            oneforall.managers.mutesManager.getAndCreateIfNotExists(`${interaction.guildId}-${member.id}`, {
                guildId: interaction.guildId,
                memberId: member.id
            }).delete()
            member.roles.remove(guildData.mute, `Unmuted by ${interaction.user.username}#${interaction.user.discriminator}`).then(() => {
                interaction.editReply({content: lang.mute.remove.success(`${member.user.username}#${member.user.discriminator}`)})
            })
        }
        if (subCommand === 'list') {
            const guildMuted = oneforall.managers.mutesManager.filter(muteManager => muteManager.guildId === interaction.guildId)
            if (guildMuted.size < 1) return interaction.editReply({content: 'No mute data'})

            const mutedEmbed = {
                title: `List of muted members (${guildMuted.size})`,
                timestamp: new Date(),
                color: '#36393F',
                footer: {
                    text: 'Page 1/1',
                    icon_url: interaction.user.displayAvatarURL({dynamic: true}) || ''
                }
            }
            let maxPerPage = 10,
                i = 0
            if (guildMuted.size > maxPerPage) {
                let page = 0,
                    slicerIndicatorMin = 0,
                    slicerIndicatorMax = 10,
                    totalPage = Math.ceil(guildMuted.size / maxPerPage)

                const embedPageChanger = (page) => {
                    i = 0
                    mutedEmbed.description = guildMuted.map((muteManager, _, k, p) => {
                        i++
                        return `${i} ・ <@${muteManager.memberId}> ・ Expire ${!muteManager.expiredAt ? 'Never' : `<t:${oneforall.functions.dateToEpoch(new Date(muteManager.expiredAt))}:R>`}- Reason: \`${muteManager.reason}\` - Author: <@${muteManager.authorId}>`
                    }).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                    mutedEmbed.footer.text = `Page ${page + 1} / ${totalPage}`
                    return mutedEmbed
                }
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`left.${interaction.id}`)
                        .setEmoji('◀️')
                        .setStyle('SECONDARY')
                ).addComponents(
                    new MessageButton()
                        .setCustomId(`cancel.${interaction.id}`)
                        .setEmoji('❌')
                        .setStyle('SECONDARY')
                ).addComponents(
                    new MessageButton()
                        .setCustomId(`right.${interaction.id}`)
                        .setEmoji('➡️')
                        .setStyle('SECONDARY')
                )
                const componentFilter = {
                    filter: interactionChanger => interactionChanger.customId.includes(interaction.id) && interactionChanger.user.id === interaction.user.id,
                    time: 900000
                }
                await interaction.editReply({content: null, embeds: [embedPageChanger(page)], components: [row]})
                const collector = interaction.channel.createMessageComponentCollector(componentFilter)
                collector.on('collect', async (interactionChanger) => {
                    await interactionChanger.deferUpdate()
                    const selectedButton = interactionChanger.customId.split('.')[0]
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
                    interaction.editReply({embeds: [embedPageChanger(page)], components: []})
                })
            } else {
                mutedEmbed.description = guildMuted.map((muteManager, k, u, p) => {
                    return `${p + 1} ・ <@${muteManager.memberId}> ・ Expire  ${!muteManager.expiredAt ? 'Never' : `<t:${oneforall.functions.dateToEpoch(new Date(muteManager.expiredAt))}:R>`} - Reason: \`${muteManager.reason}\` - Author: <@${muteManager.authorId}>`
                }).join('\n')
                await interaction.editReply({embeds: [mutedEmbed]})
            }
        }

        function isValidTime(time) {
            return parseInt(time.split('')[0]) > 0 && (time.endsWith('s') || time.endsWith('m') || time.endsWith('h') || time.endsWith('d'))
        }
    }

}

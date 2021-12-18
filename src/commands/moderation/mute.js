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
    run: async (oneforall, message, memberData, guildData) => {
        const {options} = message;
        const subCommand = options.getSubcommand()
        const member = options.getMember('member')
        const reason = options.getString('reason') || `Muted by ${message.author.username}#${message.author.discriminator}`
        const time = options.getString('time')
        const permToCheck = subCommand === 'add' && time ? 'TEMP_' : subCommand === 'remove' ? 'UN' : 'MUTE_CMD'
        const hasPermission = memberData.permissionManager.has(permToCheck)
        await message.deferReply({ephemeral: (!!!hasPermission)})
        const lang = guildData.langManager
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions(time ? 'tempmute' : 'mute')})
        if (!guildData.setup) return message.editReply({content: 'Please setup the bot with /setup'})
        const isMuted = oneforall.managers.mutesManager.has(`${message.guildId}-${member?.id}`)
        if (subCommand === 'add') {
            if (isMuted) return message.editReply({content: lang.mute.add.alreadyMuted})

            if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId && !oneforall.isOwner(message.author.id)) return message.editReply({content: lang.roleSuppThanAuthor})
            if (time && !oneforall.functions.isValidTime(time)) return message.editReply({content: lang.incorrectTime})
            oneforall.managers.mutesManager.getAndCreateIfNotExists(`${message.guildId}-${member.id}`, {
                guildId: message.guildId,
                memberId: member.id,
                expiredAt: time ? moment().utc().add(ms(time), 'millisecond').valueOf() : null,
                createdAt: new Date(),
                reason,
                authorId: message.author.id
            }).save().then(() => {
                member.roles.add(guildData.mute, reason)
                message.editReply({content: lang.mute.add.success(`${member.user.username}#${member.user.discriminator}`, time ? ms(time) : undefined, reason)})
            })
        }
        if (subCommand === 'remove') {
            if (!isMuted) return message.editReply({content: lang.mute.remove.notMuted})
            oneforall.managers.mutesManager.getAndCreateIfNotExists(`${message.guildId}-${member.id}`, {
                guildId: message.guildId,
                memberId: member.id
            }).delete()
            member.roles.remove(guildData.mute, `Unmuted by ${message.author.username}#${message.author.discriminator}`).then(() => {
                message.editReply({content: lang.mute.remove.success(`${member.user.username}#${member.user.discriminator}`)})
            })
        }
        if (subCommand === 'list') {
            const guildMuted = oneforall.managers.mutesManager.filter(muteManager => muteManager.guildId === message.guildId)
            if (guildMuted.size < 1) return message.editReply({content: 'No mute data'})

            const mutedEmbed = {
                title: `List of muted members (${guildMuted.size})`,
                timestamp: new Date(),
                color: guildData.embedColor,
                footer: {
                    text: 'Page 1/1',
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
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
                    mutedEmbed.description = guildMuted.map((muteManager, k, u, p) => {
                        return `${p + 1} ・ <@${muteManager.memberId}> ・ Expire  ${!muteManager.expiredAt ? 'Never' : `<t:${oneforall.functions.dateToEpoch(new Date(muteManager.expiredAt))}:R>`} - Reason: \`${muteManager.reason}\` - Author: <@${muteManager.authorId}>`
                    }).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                    mutedEmbed.footer.text = `Page ${page + 1} / ${totalPage}`
                    return mutedEmbed
                }
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`left.${message.id}`)
                        .setEmoji('◀️')
                        .setStyle('SECONDARY')
                ).addComponents(
                    new MessageButton()
                        .setCustomId(`cancel.${message.id}`)
                        .setEmoji('❌')
                        .setStyle('SECONDARY')
                ).addComponents(
                    new MessageButton()
                        .setCustomId(`right.${message.id}`)
                        .setEmoji('➡️')
                        .setStyle('SECONDARY')
                )
                const componentFilter = {
                    filter: messageChanger => messageChanger.customId.includes(message.id) && messageChanger.user.id === message.author.id,
                    time: 900000
                }
                await message.editReply({content: null, embeds: [embedPageChanger(page)], components: [row]})
                const collector = message.channel.createMessageComponentCollector(componentFilter)
                collector.on('collect', async (messageChanger) => {
                    await messageChanger.deferUpdate()
                    const selectedButton = messageChanger.customId.split('.')[0]
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
                    message.editReply({embeds: [embedPageChanger(page)], components: []})
                })
            } else {
                mutedEmbed.description = guildMuted.map((muteManager, k, u, p) => {
                    return `${p + 1} ・ <@${muteManager.memberId}> ・ Expire  ${!muteManager.expiredAt ? 'Never' : `<t:${oneforall.functions.dateToEpoch(new Date(muteManager.expiredAt))}:R>`} - Reason: \`${muteManager.reason}\` - Author: <@${muteManager.authorId}>`
                }).join('\n')
                await message.editReply({embeds: [mutedEmbed]})
            }
        }

        function isValidTime(time) {
            return parseInt(time.split('')[0]) > 0 && (time.endsWith('s') || time.endsWith('m') || time.endsWith('h') || time.endsWith('d'))
        }
    }

}

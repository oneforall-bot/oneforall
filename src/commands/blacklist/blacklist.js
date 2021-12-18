const {MessageActionRow, MessageButton} = require("discord.js");
module.exports = {
    data: {
        name: `blacklist`,
        description: `Allows you manage the blacklist`,
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'add',
                description: 'Allows you to blacklist a user',
                options: [
                    {
                        name: "member",
                        description: "User you want to blacklist",
                        required: true,
                        type: "USER"
                    },

                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'remove',
                description: 'Allows you to unblacklist a user',
                options: [
                    {
                        name: "member",
                        description: "User you want to unblacklist",
                        required: true,
                        type: "USER"
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'list',
                description: 'Allows you to see who is blacklisted ',
            }
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("BLACKLIST_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const subCommand = message.options.getSubcommand()
        if (subCommand === 'add') {

            const targetUser = message.options.getUser('member');
            if (!hasPermission || !targetUser) {
                return message.editReply({
                    content: `${!hasPermission ? "You do not have permission." : `This user is invalid !`}`
                });

            }

            const alreadyBlacklisted = oneforall.managers.blacklistManager.find(v => v.guildId === message.guildId && targetUser.id === v.userId);

            if (alreadyBlacklisted)
                return message.editReply({
                    embeds: [
                        {
                            description: `<@${targetUser.id}> already blacklisted by <@${alreadyBlacklisted.authorId}> \n\n Reason: \`${alreadyBlacklisted.reason}\``
                        }
                    ],
                    ephemeral: true
                });

            oneforall.managers.blacklistManager.getAndCreateIfNotExists(`${message.guildId}-${targetUser.id}`, {
                guildId: message.guildId,
                userId: targetUser.id,
                authorId: message.author.id,
            }).save().then(() => {
                message.guild.members.ban(targetUser, {
                    reason: `Blacklisted by ${message.author.tag}`
                })
            });

            message.editReply({
                embeds: [
                    {
                        description: `<@${targetUser.id}> successfully blacklisted by <@${message.author.id}>`
                    }
                ]
            }).catch(() => {
            })
        }
        if (subCommand === 'remove') {

            const targetUser = message.options.getUser('member');
            if (!hasPermission || !targetUser || targetUser.bot) {
                return message.editReply({
                    content: `${!hasPermission ? "You do not have permission." : `This user is invalid !`}`
                });

            }

            const alreadyBlacklisted = oneforall.managers.blacklistManager.find(v => v.guildId === message.guildId && targetUser.id === v.userId);

            if (!alreadyBlacklisted)
                return message.editReply({
                    embeds: [
                        {
                            description: `<@${targetUser.id}> is not blacklisted`
                        }
                    ],
                    ephemeral: true
                });

            oneforall.managers.blacklistManager.getAndCreateIfNotExists(`${message.guildId}-${targetUser.id}`).delete()
            message.guild.members.unban(targetUser, `UnBlacklisted by ${message.author.tag}`)

            message.editReply({
                embeds: [
                    {
                        description: `<@${targetUser.id}> successfully unblacklisted by <@${message.author.id}>`
                    }
                ]
            }).catch(() => {
            })
        }
        if (subCommand === 'list') {
            if (!hasPermission) {
                return message.editReply({
                    content: "You do not have permission."
                });

            }
            const blacklist = oneforall.managers.blacklistManager.filter(bl => bl.guildId === message.guildId)
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`blacklist.left.${message.id}`)
                        .setEmoji('◀️')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`blacklist.cancel.${message.id}`)
                        .setEmoji('❌')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`blacklist.right.${message.id}`)
                        .setEmoji('➡️')
                        .setStyle('SECONDARY')
                )
            const componentFilter = {
                filter: messageList => messageList.customId.includes(`antiraid`) && messageList.customId.includes(message.id) && messageList.user.id === message.author.id,
                time: 900000
            }
            const fields = []
            let slicerIndicatorMin = 0,
                slicerIndicatorMax = 10,
                page = 0,
                maxPerPage = 10,
                totalPage = Math.ceil(blacklist.size / maxPerPage)
            const embed = {
                timestamp: new Date(),
                color: guildData.embedColor,
                fields: fields.slice(0, maxPerPage),
                title: `Blacklist (${blacklist.size})`,
                footer: {
                    text: `Blacklist ・ Page 1/${totalPage}`,
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                },
            }
            const embedPageChanger = (page) => {
                embed.description = blacklist.map((blacklist, key) => `<@${blacklist.userId}> ・ ${blacklist.reason}`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                embed.footer.text = `Blacklist ・ Page ${page + 1} / ${totalPage}`
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

            await message.editReply({embeds: [embedPageChanger(page)], components: [row]})
        }

    }
}

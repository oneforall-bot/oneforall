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
    run: async (oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("BLACKLIST_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        const subCommand = interaction.options.getSubcommand()
        if (subCommand === 'add') {

            const targetUser = interaction.options.getUser('member');
            if (!hasPermission || !targetUser) {
                return interaction.editReply({
                    content: `${!hasPermission ? "You do not have permission." : `This user is invalid !`}`
                });

            }

            const alreadyBlacklisted = oneforall.managers.blacklistManager.find(v => v.guildId === interaction.guildId && targetUser.id === v.userId);

            if (alreadyBlacklisted)
                return interaction.editReply({
                    embeds: [
                        {
                            description: `<@${targetUser.id}> already blacklisted by <@${alreadyBlacklisted.authorId}> \n\n Reason: \`${alreadyBlacklisted.reason}\``
                        }
                    ],
                    ephemeral: true
                });

            oneforall.managers.blacklistManager.getAndCreateIfNotExists(`${interaction.guildId}-${targetUser.id}`, {
                guildId: interaction.guildId,
                userId: targetUser.id,
                authorId: interaction.user.id,
            }).save().then(() => {
                interaction.guild.members.ban(targetUser, {
                    reason: `Blacklisted by ${interaction.user.tag}`
                })
            });

            interaction.editReply({
                embeds: [
                    {
                        description: `<@${targetUser.id}> successfully blacklisted by <@${interaction.user.id}>`
                    }
                ]
            }).catch(() => {
            })
        }
        if (subCommand === 'remove') {

            const targetUser = interaction.options.getUser('member');
            if (!hasPermission || !targetUser || targetUser.bot) {
                return interaction.editReply({
                    content: `${!hasPermission ? "You do not have permission." : `This user is invalid !`}`
                });

            }

            const alreadyBlacklisted = oneforall.managers.blacklistManager.find(v => v.guildId === interaction.guildId && targetUser.id === v.userId);

            if (!alreadyBlacklisted)
                return interaction.editReply({
                    embeds: [
                        {
                            description: `<@${targetUser.id}> is not blacklisted`
                        }
                    ],
                    ephemeral: true
                });

            oneforall.managers.blacklistManager.getAndCreateIfNotExists(`${interaction.guildId}-${targetUser.id}`).delete()
            interaction.guild.members.unban(targetUser, `UnBlacklisted by ${interaction.user.tag}`)

            interaction.editReply({
                embeds: [
                    {
                        description: `<@${targetUser.id}> successfully unblacklisted by <@${interaction.user.id}>`
                    }
                ]
            }).catch(() => {
            })
        }
        if (subCommand === 'list') {
            if (!hasPermission) {
                return interaction.editReply({
                    content: "You do not have permission."
                });

            }
            const blacklist = oneforall.managers.blacklistManager.filter(bl => bl.guildId === interaction.guildId)
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`blacklist.left.${interaction.id}`)
                        .setEmoji('◀️')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`blacklist.cancel.${interaction.id}`)
                        .setEmoji('❌')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`blacklist.right.${interaction.id}`)
                        .setEmoji('➡️')
                        .setStyle('SECONDARY')
                )
            const componentFilter = {
                filter: interactionList => interactionList.customId.includes(`antiraid`) && interactionList.customId.includes(interaction.id) && interactionList.user.id === interaction.user.id,
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
                color: '#36393F',
                fields: fields.slice(0, maxPerPage),
                title: `Blacklist (${blacklist.size})`,
                footer: {
                    text: `Blacklist ・ Page 1/${totalPage}`,
                    icon_url: interaction.user.displayAvatarURL({dynamic: true}) || ''
                },
            }
            const embedPageChanger = (page) => {
                embed.description = blacklist.map((blacklist, key) => `<@${blacklist.userId}> ・ ${blacklist.reason}`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                embed.footer.text = `Blacklist ・ Page ${page + 1} / ${totalPage}`
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

            await interaction.editReply({embeds: [embedPageChanger(page)], components: [row]})
        }

    }
}

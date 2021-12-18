const {MessageActionRow, MessageSelectMenu, Util} = require("discord.js");
module.exports = {
    data: {
        name: 'invite',
        description: 'Send welcome message and count invites',
        options: [
            {
                type: "SUB_COMMAND",
                name: 'config',
                description: 'Config the invite system',
            },
            {
                type: "SUB_COMMAND",
                name: 'add',
                description: 'Add invites to a member',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to give invites',
                        required: true
                    },
                    {
                        type: 'INTEGER',
                        name: 'amount',
                        description: 'The amount of invites to add',
                        required: true
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: 'remove',
                description: 'Remove invites to a member',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to remove invites',
                        required: true
                    },
                    {
                        type: 'INTEGER',
                        name: 'amount',
                        description: 'The amount of invites to remove',
                        required: true
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: 'reset',
                description: 'Reset invites on the server or a member',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to reset invite',
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: 'show',
                description: 'Show invites of a member',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to show invites',
                    }
                ]
            },
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const lang = guildData.langManager
        const subCommand = message.options.getSubcommand()
        const hasPermission = memberData.permissionManager.has(`INVITE_${subCommand.toUpperCase()}_CMD`) || subCommand === 'show'
        await message.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions(`invite ${subCommand}`)})
        if (subCommand === 'config') {
            let {invites} = guildData
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`invite.${message.id}`)
                        .setPlaceholder(lang.invite.config.placeholder)
                        .addOptions(lang.invite.config.selectMenuOptions(invites.enable))
                )


            const embed = {
                title: 'Configuration',
                fields: [
                    {
                        name: 'Channel',
                        value: invites.channel ? `<#${invites.channel}>` : lang.undefined
                    },
                    {
                        name: 'Message',
                        value: invites.message || lang.undefined
                    },
                    {
                        name: 'Enable',
                        value: invites.enable ? '\`✅\`' : '\`❌\`'
                    },
                ],
                ...oneforall.embed(guildData),
                timestamp: new Date()
            }
            const panel = await message.editReply({
                embeds: [embed], components: [row]
            })
            const componentFilter = {
                    filter: messageReactrole => messageReactrole.customId === `invite.${message.id}` && messageReactrole.user.id === message.author.id,
                    time: 900000
                },
                awaitMessageFilter = {
                    filter: response => response.author.id === message.author.id,
                    time: 900000,
                    limit: 1,
                    max: 1,
                    errors: ['time']
                }
            const collector = message.channel.createMessageComponentCollector(componentFilter)
            collector.on('collect', async (messageReactrole) => {
                await messageReactrole.deferUpdate()
                const selectedOption = messageReactrole.values[0]
                if (selectedOption === "channel") {
                    const questionAnswer = await generateQuestion(lang.invite.config.chQ)
                    if (questionAnswer.content === 'cancel') return errorMessage(lang.cancel)
                    const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content)
                    if (!channel || channel.deleted) return errorMessage(lang.invite.config.invalidChannel)
                    if (!channel.isText()) return errorMessage(lang.invite.config.notText)
                    invites.channel = channel.id
                    await updateEmbed()
                    return errorMessage(lang.invite.config.successCh(channel.toString()))
                }
                if (selectedOption === 'message') {
                    const {content} = await generateQuestion(lang.invite.config.msgQ)
                    if (content === 'cancel') return errorMessage(lang.cancel)

                    invites.message = content
                    await updateEmbed()
                }
                if (selectedOption === 'help') {
                    const helpEmbed = {
                        title: 'Help variables invites',
                        description: lang.invite.config.help,
                        timestamp: new Date()
                    }
                    message.channel.send({embeds: [helpEmbed]})
                }
                if (selectedOption === 'enable') {
                    invites.enable = !invites.enable
                    row.components[0].options = lang.invite.config.selectMenuOptions(invites.enable)
                    await panel.edit({components: [row]})
                    await updateEmbed()
                }
                if (selectedOption === 'save') {
                    if (!invites.message) return errorMessage(lang.invite.config.noMsg)
                    if (!invites.channel) return errorMessage(lang.invite.config.noChannel)
                    guildData.save()
                    collector.stop()
                    messageReactrole.deleteReply()
                    errorMessage(lang.invite.config.success)
                    await panel.delete().catch(() => {})

                }
            })

            async function generateQuestion(question) {
                const messageQuestion = await message.channel.send(question)
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
                const collected = await messageQuestion.channel.awaitMessages(awaitMessageFilter)
                await messageQuestion.delete()
                await collected.first().delete()
                row.components[0].setDisabled(false)
                await panel.edit({
                    components: [row]
                })
                return collected.first()
            }

            function errorMessage(reply) {
                return message.channel.send(reply).then(mp => setTimeout(() => mp.delete(), 4000));
            }

            async function updateEmbed() {
                embed.fields[0].value = !invites.channel ? lang.undefined : `<#${invites.channel}>`;
                embed.fields[1].value = invites.message || lang.undefined;
                embed.fields[2].value = !invites.enable ? '\`❌\`' : '\`✅\`'
                await panel.edit({embeds: [embed]})
            }
        }
        if (subCommand === 'add' || subCommand === 'remove') {
            const {member, user} = message.options.get('member')
            const amount = message.options.get('amount').value
            const targetData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${user.id}`, {
                guildId: message.guild.id,
                memberId: user.id
            })
            const {invites} = targetData
            subCommand === 'remove' ? invites.join -= amount : invites.join += amount
            subCommand === 'remove' ? invites.bonus -= amount : invites.bonus += amount
            targetData.save().then(() => {
                message.editReply({content: lang.invite.add.success(user.toString(), amount, subCommand)})
            })

        }
        if (subCommand === 'reset') {
            let user = message.options.get('member')?.user
            const defaultInvite = {join: 0, leave: 0, fake: 0, bonus: 0}
            if (user) {
                const targetData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${user.id}`, {
                    guildId: message.guild.id,
                    memberId: user.id
                })

                targetData.invites = defaultInvite
                targetData.save()
            } else {
                const membersInGuild = oneforall.managers.membersManager.filter(memberData => memberData.guildId === message.guild.id)
                if (membersInGuild.size > 0)
                    for (const [key, memberData] of membersInGuild) {
                        memberData.invites = defaultInvite
                        memberData.save()
                    }
            }
            await message.editReply({content: lang.invite.reset(user)})

        }
        if (subCommand === 'show') {
            let user = message.options.getUser('member')|| message.author

            if (user) {
                memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${user.id}`, {
                    guildId: message.guild.id,
                    memberId: user.id
                })
            }
            const {invites} = memberData
            message.editReply({embeds: [lang.invite.show(user, invites, oneforall.functions.getTotalInvite(invites))]})
        }
    }
}

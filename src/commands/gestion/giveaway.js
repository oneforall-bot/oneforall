const ms = require('ms'),
    {Collection, MessageActionRow, MessageSelectMenu} = require('discord.js'),
    oldGiveawayOptions = new Collection()


module.exports = {
    data: {
        name: 'giveaway',
        description: 'Manage giveaways',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'create',
                description: 'Create a giveaway',
                options: [
                    {
                        type: 'STRING',
                        description: 'The prize of the giveaway',
                        name: 'prize',
                    },
                    {
                        type: 'STRING',
                        description: 'The time of the giveaway',
                        name: 'time'
                    },
                    {
                        type: 'INTEGER',
                        name: 'winners',
                        description: 'The amount of winners for the giveaway'
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'delete',
                description: 'Delete a giveaway',
                options: [
                    {
                        type: 'STRING',
                        name: 'id',
                        description: 'The message id of the giveaway to delete',
                        required: true,
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'end',
                description: 'End a giveaway',
                options: [
                    {
                        type: 'STRING',
                        name: 'id',
                        description: 'The message id of the giveaway to end',
                        required: true,
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'reroll',
                description: 'Reroll a giveaway',
                options: [
                    {
                        type: 'STRING',
                        name: 'id',
                        description: 'The message id of the giveaway to reroll',
                        required: true,
                    }
                ]
            },
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const subCommand = message.options.getSubcommand()
        const {options} = message
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("GIVEAWAY_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission)
            return message.editReply({
                content: lang.notEnoughPermissions('giveaway')
            });
        let giveawayOptions = {messages: lang.giveaway.messages, boost: false, voice: false, invitation: 0}
        if (oldGiveawayOptions.has(message.guildId)) giveawayOptions = oldGiveawayOptions.get(message.guildId)
        if (subCommand === 'create') {
            const time = options.get('time')?.value
            const prize = options.get('prize')?.value
            const winners = options.get('winners')?.value
            if (time && !oneforall.functions.isValidTime(time)) {
                return await message.editReply({content: lang.giveaway.create.incorrectTime})
            }
            giveawayOptions.hostedBy = message.author;
            giveawayOptions.prize = prize ? prize : giveawayOptions.prize
            giveawayOptions.winnerCount = winners ? winners : giveawayOptions.winnerCount
            giveawayOptions.duration = time ? ms(time) : giveawayOptions.duration
            if (time && prize && winners) {
                giveawayOptions.channel = message.channel;
                oneforall.giveawaysManager.start(giveawayOptions.channel, giveawayOptions)
                await message.editReply({content: `Giveaway launched in ${message.channel.toString()}`})

            } else {
                const embed = lang.giveaway.create.embed(giveawayOptions.duration, giveawayOptions.channel, giveawayOptions.winnerCount, giveawayOptions.voice, giveawayOptions.boost, giveawayOptions.role, giveawayOptions.status, giveawayOptions.invitation, giveawayOptions.reaction, giveawayOptions.prize)
                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu().setPlaceholder(lang.giveaway.create.placeholder).setCustomId(`giveaway.${message.id}`).setOptions(lang.giveaway.create.selectMenuOptions(giveawayOptions.voice, giveawayOptions.boost))
                )
                const panel = await message.editReply({embeds: [embed], components: [row]})

                function updateEmbed() {
                    const embed = lang.giveaway.create.embed(giveawayOptions.duration, giveawayOptions.channel, giveawayOptions.winnerCount, giveawayOptions.voice, giveawayOptions.boost, giveawayOptions.role, giveawayOptions.status, giveawayOptions.invitation, giveawayOptions.reaction, giveawayOptions.prize)
                    panel.edit({embeds: [embed], components: [row]})
                }

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

                const componentFilter = {
                        filter: messageReactrole => messageReactrole.customId === `giveaway.${message.id}` && messageReactrole.user.id === message.author.id,
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
                collector.on('collect', async (messageGiveaway) => {
                    await messageGiveaway.deferUpdate()
                    const selectedOption = messageGiveaway.values[0]
                    switch (selectedOption) {
                        case 'start':
                            if (!giveawayOptions.channel) giveawayOptions.channel = message.channel
                            if (!giveawayOptions.winnerCount) giveawayOptions.winnerCount = 1
                            if (!giveawayOptions.prize) return oneforall.functions.tempMessage(message, lang.giveaway.create.noPrize)
                            // giveawayOptions.exemptMembers = (member, giveawayOptions) => (giveawayOptions.voice ? !member.voice?.channelId : true) && (giveawayOptions.boost ? !member.premiumSince : true) && (giveawayOptions.role ? !member.roles.cache.has(giveawayOptions.role) : true) && (giveawayOptions.status ? !member.presence?.activities.find(activity => activity.type === 'CUSTOM')?.state.includes(giveawayOptions.status) : true) && (giveawayOptions.invitation > 0 ? member.client.managers.membersManager.getAndCreateIfNotExists(`${message.guildId}-${member.id}`, {guildId: message.guildId, memberId: member.id}).invites.join < giveawayOptions.invitation: true)
                            giveawayOptions.exemptMembers = new Function('member', `return ${giveawayOptions.voice ? '!member.voice?.channelId' : 'false'} || ${giveawayOptions.boost ? 'member.premiumSince === null' : 'false'}|| ${giveawayOptions.role ? `!member.roles.cache.has('${giveawayOptions.role.id}')` : 'false'}|| ${giveawayOptions.status ? `!member.presence?.activities.find(activity => activity.type === 'CUSTOM')?.state.includes('${giveawayOptions.status}')` : 'false'} ||  ${giveawayOptions.invitation > 0 ? `member.client.managers.membersManager.getAndCreateIfNotExists('${message.guildId}-' + member.id, {guildId: '${message.guildId}', memberId: member.id}).invites.join <= ${giveawayOptions.invitation}` : 'false'}`)
                            oneforall.giveawaysManager.start(giveawayOptions.channel, giveawayOptions)
                            await message.editReply({content: `Giveaway launched in ${giveawayOptions.channel.toString()}`})

                            break;
                        case 'boost':
                        case  'voice':
                            giveawayOptions[selectedOption === 'voice' ? 'voice' : 'boost'] = !giveawayOptions[selectedOption === 'voice' ? 'voice' : 'boost']
                            updateEmbed()
                            break;
                        default:
                            const questionAnswer = await generateQuestion(lang.giveaway.create.question[selectedOption])
                            if (questionAnswer.content === 'cancel') return oneforall.functions.tempMessage(message, lang.cancel)
                            if (selectedOption === 'channel') {
                                const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content);
                                if (!channel || !channel?.isText()) return oneforall.functions.tempMessage(message, lang.giveaway.create.inccorectResponse.channel)
                                questionAnswer.content = channel
                                oneforall.functions.tempMessage(message, lang.giveaway.create.successMessage.channel(channel.toString()))
                            }
                            if (selectedOption === 'role') {
                                const role = questionAnswer.mentions.roles.first() || message.guild.roles.cache.get(questionAnswer.content)
                                if (!role || oneforall.functions.roleHasSensiblePermissions(role.permissions)) return oneforall.functions.tempMessage(message, lang.giveaway.create.inccorectResponse.role)
                                questionAnswer.content = role
                            }
                            if (selectedOption === 'duration' && !oneforall.functions.isValidTime(questionAnswer.content)) return oneforall.functions.tempMessage(message, lang.giveaway.create.incorrectTime)
                            else if (selectedOption === 'duration') questionAnswer.content = ms(questionAnswer.content)
                            if (selectedOption === 'winnerCount' && !isValidWinner(questionAnswer.content)) return oneforall.functions.tempMessage(message, lang.giveaway.create.inccorectWinner)
                            else if (selectedOption === 'winnerCount') questionAnswer.content = parseInt(questionAnswer.content)
                            if (selectedOption === 'invitation' && isNaN(questionAnswer.content)) return oneforall.functions.tempMessage(message, 'Wrong number')
                            else if (selectedOption === 'invitation') questionAnswer.content = parseInt(questionAnswer.content)
                            giveawayOptions[selectedOption] = questionAnswer.content
                            updateEmbed()
                    }
                })
            }


            oldGiveawayOptions.set(message.guildId, giveawayOptions)
        }
        if (subCommand === 'delete') {
            const messageId = message.options.getString('id')
            oneforall.giveawaysManager.delete(messageId).then(() => {
                message.editReply({content: lang.giveaway.delete})
            }).catch(e => {
                message.editReply({content: 'No giveaway found'})
            })
        }
        if (subCommand === 'end') {
            const messageId = message.options.getString('id')
            oneforall.giveawaysManager.end(messageId).then(() => {
                message.editReply({content: lang.giveaway.end})
            }).catch(e => {
                message.editReply({content: 'No giveaway found'})
            })
        }
        if (subCommand === 'reroll') {
            const messageId = message.options.getString('id')
            await oneforall.giveawaysManager.reroll(messageId, lang.giveaway.messages).then(() => {
                message.editReply({content: lang.giveaway.reroll})
            }).catch(e => {
                message.editReply({content: 'No giveaway found'})
            })
        }
    }
}

function isValidWinner(winner) {
    return !isNaN(winner) || parseInt(winner) >= 0
}


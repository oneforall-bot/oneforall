const {MessageActionRow, MessageSelectMenu, Util} = require("discord.js");
module.exports = {
    data: {
        name: `reactrole`,
        description: `Allows you to create reactroles`,

    },
    run: async (oneforall, message, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("REACTROLE_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission)
            return message.editReply({
                content: lang.notEnoughPermissions('reactrole')
            });
        let {reactroles} = guildData
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`reactrole.${message.id}`)
                    .setPlaceholder(guildData.langManager.reactrole.placeholder)
                    .addOptions(guildData.langManager.reactrole.selectMenuOptions)
            )

        const reactRole = {
            channel: guildData.langManager.undefined,
            message: guildData.langManager.undefined,
            emojiRoleMapping: new oneforall.Collection()
        }
        const embed = {
            title: 'Configuration',
            fields: [
                {
                    name: 'Channel',
                    value: reactRole.channel
                },
                {
                    name: 'Message',
                    value: reactRole.message
                },
                {
                    name: 'Role with emoji',
                    value: guildData.langManager.undefined
                },
            ],
            timestamp: new Date(),
            ...oneforall.embed(guildData)
        }
        const panel = await message.editReply({
            embeds: [embed], components: [row]
        })
        const componentFilter = {
                filter: messageReactrole => messageReactrole.customId === `reactrole.${message.id}` && messageReactrole.user.id === message.author.id,
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
                const questionAnswer = await generateQuestion(guildData.langManager.reactrole.chQ)
                if (questionAnswer.content === 'cancel') return errorMessage(guildData.langManager.cancel)
                const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content)
                if (!channel || channel.deleted) return errorMessage(guildData.langManager.reactrole.invalidChannel)
                if (!channel.isText()) return errorMessage(guildData.langManager.reactrole.notText)
                reactRole.channel = channel.id
                await updateEmbed()
                return errorMessage(guildData.langManager.reactrole.successCh(channel.toString()))
            }
            if (selectedOption === 'message') {
                const {content} = await generateQuestion(guildData.langManager.reactrole.msgIdQ)
                if (content === 'cancel') return errorMessage(guildData.langManager.cancel)
                if (isNaN(content)) return errorMessage(guildData.langManager.reactrole.notId)
                if (reactRole.channel === guildData.langManager.undefined || !message.guild.channels.cache.get(reactRole.channel)) return errorMessage(guildData.langManager.reactrole.noChannel)
                let fetchedMessage;
                try {
                    fetchedMessage = await message.guild.channels.cache.get(reactRole.channel).messages.fetch(content)
                } catch (e) {
                    return errorMessage(guildData.langManager.reactrole.invalidId)
                }
                if (reactroles.find(reactrole => reactrole.message === fetchedMessage.id)) return errorMessage(guildData.langManager.reactrole.alreadyReact)
                reactRole.message = fetchedMessage.id
                await updateEmbed()
            }
            if (selectedOption === 'add-role') {
                const questionAnswerRole = await generateQuestion(guildData.langManager.reactrole.roleQ)
                if (questionAnswerRole.content === 'cancel') return errorMessage(guildData.langManager.cancel)
                const role = questionAnswerRole.mentions.roles.first() || message.guild.roles.cache.get(questionAnswerRole.content)
                if (!role || role.id === message.guild.roles.everyone.id) return errorMessage(guildData.langManager.reactrole.roleNotValid)
                if (role.managed) return errorMessage(guildData.langManager.managedRole)
                if (oneforall.functions.roleHasSensiblePermissions(role.permissions)) return errorMessage(guildData.langManager.tryToPermsRole)

                for (const [key, value] of reactRole.emojiRoleMapping) {
                    if (value === role.id) return errorMessage(guildData.langManager.reactrole.roleAlready)
                }

                const questionAnswerEmoji = await generateQuestion(guildData.langManager.reactrole.emojiQ)
                let emoji = Util.parseEmoji(questionAnswerEmoji.content)
                if (emoji.id) {
                    const tempEmoji = oneforall.emojis.cache.get(emoji.id)
                    if (!tempEmoji) {
                        const questionAddEmoji = await generateQuestion(guildData.langManager.reactrole.emojiDoesNotExist)
                        const name = questionAddEmoji.content
                        const link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
                        emoji = await message.guild.emojis.create(link, name, {reason: `emoji reaction role by ${message.author.username + '#' + message.author.discriminator}`})
                    } else {
                        emoji = tempEmoji
                    }
                }
                if (reactRole.emojiRoleMapping.has(!emoji.id ? emoji.name : emoji.id)) return errorMessage(guildData.langManager.reactrole.emojiAlready)
                reactRole.emojiRoleMapping.set(!emoji.id ? emoji.name : emoji.id, role.id)
                return await updateEmbed()
            }
            if (selectedOption === 'del-role') {
                const questionAnswer = await generateQuestion(guildData.langManager.reactrole.roleDelQ)
                if (!reactRole.emojiRoleMapping.size) return errorMessage(guildData.langManager.reactrole.noRole)
                if (questionAnswer.content === 'cancel') return errorMessage(guildData.langManager.cancel)
                const role = questionAnswer.mentions.roles.first() || message.guild.roles.cache.get(questionAnswer.content)
                if (!role) return errorMessage(guildData.langManager.reactrole.roleNotValid)
                if (role.managed) return errorMessage(guildData.langManager.managedRole)
                for (const [key, value] of reactRole.emojiRoleMapping) {
                    if (value !== role.id) return errorMessage(guildData.langManager.reactrole.roleNotFound)
                    reactRole.emojiRoleMapping.delete(key)
                }
                await updateEmbed()
            }
            if (selectedOption === 'delete') {
                const questionAnswer = await generateQuestion(guildData.langManager.reactrole.msgDeleteQ)
                if (questionAnswer.content === 'cancel') return errorMessage(guildData.langManager.cancel)
                if (isNaN(questionAnswer.content)) return errorMessage(guildData.langManager.reactrole.notId)
                const toDelete = reactroles.find(reactrole => reactrole.message === questionAnswer.content);
                if (!toDelete) return errorMessage(guildData.langManager.reactrole.notChannelReactrole)
                const fetchMessage = await message.guild.channels.cache.get(toDelete.channel).messages.fetch(toDelete.message);
                if (fetchMessage) {
                    await fetchMessage.reactions.removeAll()
                }
                guildData.reactroles = reactroles.filter(react => react.message !== questionAnswer.content)
                guildData.save()
                await updateEmbed()
                errorMessage(guildData.langManager.reactrole.successDel)
            }
            if (selectedOption === 'save') {
                if (reactRole.message === guildData.langManager.undefined) return errorMessage(guildData.langManager.reactrole.noMsg)
                if (!reactRole.emojiRoleMapping.size) return errorMessage(guildData.langManager.reactrole.noEmoji)
                const fetchedMsg = await message.guild.channels.cache.get(reactRole.channel).messages.fetch(reactRole.message)
                for (const [key, value] of reactRole.emojiRoleMapping) {
                    await fetchedMsg.react(`${key}`)
                }
                reactRole.emojiRoleMapping = Object.fromEntries(reactRole.emojiRoleMapping);
                guildData.reactroles = [...reactroles, reactRole]
                guildData.save()
                panel.delete()
                return errorMessage(guildData.langManager.reactrole.success)
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
            let emojiArray;
            let emoji = []
            let channelMsg = reactRole.channel
            if (!isNaN(channelMsg)) channelMsg = `<#${channelMsg}>`
            if (reactRole.emojiRoleMapping.size !== 0) {
                emojiArray = Object.fromEntries(reactRole.emojiRoleMapping)

                if (emojiArray.length === 0) {
                    emoji.push('Non définie')
                } else {
                    for (const [key, value] of Object.entries(emojiArray)) {
                        let emojis
                        if (!isNaN(key)) {
                            const ee = oneforall.emojis.cache.get(key)
                            if (ee.animated) {
                                emojis = `<a:${ee.name}:${ee.id}>・<@&${value}>\n`
                            } else {
                                emojis = `<:${ee.name}:${ee.id}>・<@&${value}>\n`

                            }

                        } else {
                            emojis = `${key}・<@&${value}>\n`
                        }
                        emoji.push(emojis)
                    }
                }

            } else {
                emoji.push(guildData.langManager.undefined)
            }
            embed.fields[0].value = channelMsg;
            embed.fields[1].value = reactRole.message;
            embed.fields[2].value = emoji.join('\n');
            panel.edit({embeds: [embed]})
        }
    }
}

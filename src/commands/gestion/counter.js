const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
module.exports = {
    data: {
        name: 'counter',
        description: 'Manage counters on the server',
    },
    run: async (oneforall, message, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("COUNTER_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission)
            return message.editReply({
                content: lang.notEnoughPermissions('counter')
            });
        const tempCouter = {...guildData.counters}
        const embed = {
            footer: {
                text: message.author.username, icon_url: message.author.displayAvatarURL(
                    {dynamic: true}
                )
            },
            ...oneforall.embed(guildData), ...lang.counter.embed(tempCouter.member, tempCouter.voice, tempCouter.online, tempCouter.offline,
                tempCouter.boostCount, tempCouter.boosterCount)
        }
        const components = [
            new MessageSelectMenu()
                .setOptions(lang.counter.selectMenu)
                .setPlaceholder('Choose an action')
                .setCustomId(`counter.${message.id}`),
            new MessageButton()
                .setCustomId(`valid.${message.id}`)
                .setEmoji('✅')
                .setStyle('SECONDARY')
        ]
        const componentFilter = {
                filter: messageCollector => messageCollector.customId.includes(message.id) && messageCollector.user.id === message.author.id,
                time: 900000
            },
            awaitMessageFilter = {
                filter: response => response.author.id === message.author.id,
                time: 900000,
                limit: 1,
                max: 1,
                errors: ['time']
            }
        let selectedMenu
        const collector = message.channel.createMessageComponentCollector(componentFilter)
        collector.on('collect', async (messageCollector) => {
            await messageCollector.deferUpdate()
            if (messageCollector.componentType === 'BUTTON') {
                guildData.counters = tempCouter
                return guildData.save().then(async () => {
                    for (const key in guildData.counters) {
                        if (guildData.counters[key]) {
                            const channel = message.guild.channels.cache.get(guildData.counters[key]?.channel)
                            if (channel) {
                                const value = key === 'member' ? message.guild.memberCount : key === 'voice' ? (await message.guild.members.fetch()).filter(member => member.voice.channelId).size
                                    : key === 'online' ? (await message.guild.members.fetch({withPresences: true})).filter(member => member.presence?.status === 'online' || member.presence?.status === 'dnd' || member.presence?.status === 'idle').size :
                                        key === 'offline' ? (await message.guild.members.fetch({withPresences: true})).filter(member =>  member.presence?.status !== 'online' || member.presence?.status !== 'dnd' || member.presence?.status !== 'idle' ).size :
                                            key === 'boostCount' ? message.guild.premiumSubscriptionCount : (await message.guild.members.fetch()).filter(member => member.premiumSince).size
                                channel.edit({name:`${guildData.counters[key].name.replace('{count}', value.toLocaleString())}`
                            })
                            }
                        }
                    }
                    collector.stop()
                    await message.editReply({content: lang.save, components:[], embeds:[]})
                })
            }
            const selectedOption = messageCollector.values[0]
            if (Object.keys(tempCouter).includes(selectedOption)) {
                components[0].setOptions(lang.counter.configMenu)
                selectedMenu = selectedOption
                return await messageCollector.editReply({components: components.map(c => new MessageActionRow({components: [c]}))})
            }
            switch (selectedOption) {
                case 'back':
                    components[0].setOptions(lang.counter.selectMenu)
                    await messageCollector.editReply({components: components.map(c => new MessageActionRow({components: [c]}))})
                    break;
                default:
                    const questionAnswer = await generateQuestion(lang.counter.configMenu.find(sl => sl.value === selectedOption)?.question)
                    if (selectedOption === 'channel') {
                        if (questionAnswer.content === 'off') {
                             tempCouter[selectedMenu].channel = undefined
                            return updateEmbed()
                        }
                        const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content)
                        if (!channel || !channel.isVoice()) return oneforall.functions.tempMessage(message, lang.counter.invalidChannel)
                        questionAnswer.content = channel.id
                    } else {
                        if (!questionAnswer.content.includes('{count}')) return oneforall.functions.tempMessage(message, lang.counter.missingCount)
                    }
                    tempCouter[selectedMenu][selectedOption] = questionAnswer.content
                    updateEmbed()


            }
        })

        async function generateQuestion(question) {
            const messageQuestion = await message.channel.send(question)
            components[0].setDisabled(true)
            await panel.edit({
                components: components.map(c => new MessageActionRow({components: [c]}))
            })
            const collected = await messageQuestion.channel.awaitMessages(awaitMessageFilter)
            await messageQuestion.delete()
            await collected.first().delete()
            components[0].setDisabled(false)
            await panel.edit({
                components: components.map(c => new MessageActionRow({components: [c]}))
            })
            return collected.first()
        }

        const panel = await message.editReply({
            embeds: [embed],
            components: components.map(c => new MessageActionRow({components: [c]}))
        })

        function updateEmbed() {

            const embed = {
                footer: {
                    text: message.author.username, icon_url: message.author.displayAvatarURL(
                        {dynamic: true}
                    )
                },
                ...oneforall.embed(guildData), ...lang.counter.embed(tempCouter.member, tempCouter.voice, tempCouter.online, tempCouter.offline,
                    tempCouter.boostCount, tempCouter.boosterCount)
            }
            panel.edit({
                embeds: [embed],
                components: components.map(c => new MessageActionRow({components: [c]}))
            })
        }
    }
}

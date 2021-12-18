const {MessageActionRow, MessageSelectMenu, Util} = require("discord.js");
module.exports = {
    data: {
        name: 'tempvoc',
        description: 'Manage tempvoc on the server',
    },
    run: async (oneforall, message, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has(`TEMPVOC_CMD`)
        await message.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions(`tempvoc`)})
        let {tempvoc} = guildData
        const tempConfig = {...tempvoc}
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`tempvoc.${message.id}`)
                    .setPlaceholder(lang.tempvoc.placeholder)
                    .addOptions(lang.tempvoc.selectMenuOptions)
            )


        const embed = () => {
            return {
                ...oneforall.embed(guildData),
                title: 'Configuration',
                fields: [
                    {
                        name: 'Category',
                        value: tempConfig.category ? `<#${tempConfig.category}>` : lang.undefined
                    },
                    {
                        name: 'Channel',
                        value: tempConfig.channel ? `<#${tempConfig.channel}>` : lang.undefined
                    },
                    {
                        name: 'Name',
                        value: tempConfig.name
                    },
                    {
                        name: 'Enable',
                        value: tempConfig.enable ? '\`✅\`' : '\`❌\`'
                    },
                ],
                timestamp: new Date()
            }

        }
        const panel = await message.editReply({
            embeds: [embed()], components: [row]
        })
        const componentFilter = {
                filter: messageCollector => messageCollector.customId === `tempvoc.${message.id}` && messageCollector.user.id === message.author.id,
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
        collector.on('collect', async (messageCollector) => {
            await messageCollector.deferUpdate()
            const selectedOption = messageCollector.values[0]
            const selectMenu = lang.tempvoc.selectMenuOptions.find(option => option.value === selectedOption)
            switch (selectedOption) {
                case 'enable':
                    tempConfig.enable = !tempConfig.enable
                    updateEmbed()
                    break;
                case 'save':
                    if(!tempConfig.category || !tempConfig.channel || !tempConfig.name) return oneforall.functions.tempMessage(message, lang.tempvoc.missingValues)
                    guildData.tempvoc = tempConfig
                    guildData.save().then(async () =>{
                        collector.stop()
                        await panel.delete()
                        oneforall.functions.tempMessage(message, lang.save)
                    })
                    break;
                default:
                    const questionAnswer = await generateQuestion(selectMenu.question)
                    if(selectedOption === 'channel'){
                        const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content)
                        if(!channel || !channel.isVoice()) return oneforall.functions.tempMessage(message, lang.tempvoc.invalidChannel('voice'))
                        questionAnswer.content = channel.id
                        tempConfig.category = channel.parentId
                    }
                    if(selectedOption === 'category'){
                        const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content)
                        if(!channel || channel.type !== "GUILD_CATEGORY") return oneforall.functions.tempMessage(message, lang.tempvoc.invalidChannel('category'))
                        questionAnswer.content = channel.id
                    }
                    tempConfig[selectedOption] = questionAnswer.content
                    updateEmbed()
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

        function updateEmbed() {

            panel.edit({embeds: [embed()]})
        }
    }
}

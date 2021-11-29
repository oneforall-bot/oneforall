const {MessageActionRow, MessageSelectMenu, Util} = require("discord.js");
module.exports = {
    data: {
        name: 'tempvoc',
        description: 'Manage tempvoc on the server',
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has(`TEMPVOC_CMD`)
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions(`tempvoc`)})
        let {tempvoc} = guildData
        const tempConfig = {...tempvoc}
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`tempvoc.${interaction.id}`)
                    .setPlaceholder(lang.tempvoc.placeholder)
                    .addOptions(lang.tempvoc.selectMenuOptions)
            )


        const embed = () => {
            return {
                ...oneforall.embed,
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
        const panel = await interaction.editReply({
            embeds: [embed()], components: [row]
        })
        const componentFilter = {
                filter: interactionCollector => interactionCollector.customId === `tempvoc.${interaction.id}` && interactionCollector.user.id === interaction.user.id,
                time: 900000
            },
            awaitMessageFilter = {
                filter: response => response.author.id === interaction.user.id,
                time: 900000,
                limit: 1,
                max: 1,
                errors: ['time']
            }
        const collector = interaction.channel.createMessageComponentCollector(componentFilter)
        collector.on('collect', async (interactionCollector) => {
            await interactionCollector.deferUpdate()
            const selectedOption = interactionCollector.values[0]
            const selectMenu = lang.tempvoc.selectMenuOptions.find(option => option.value === selectedOption)
            switch (selectedOption) {
                case 'enable':
                    tempConfig.enable = !tempConfig.enable
                    updateEmbed()
                    break;
                case 'save':
                    if(!tempConfig.category || !tempConfig.channel || !tempConfig.name) return oneforall.functions.tempMessage(interaction, lang.tempvoc.missingValues)
                    guildData.tempvoc = tempConfig
                    guildData.save().then(async () =>{
                        collector.stop()
                        await panel.delete()
                        oneforall.functions.tempMessage(interaction, lang.save)
                    })
                    break;
                default:
                    const questionAnswer = await generateQuestion(selectMenu.question)
                    if(selectedOption === 'channel'){
                        const channel = questionAnswer.mentions.channels.first() || interaction.guild.channels.cache.get(questionAnswer.content)
                        if(!channel || !channel.isVoice()) return oneforall.functions.tempMessage(interaction, lang.tempvoc.invalidChannel('voice'))
                        questionAnswer.content = channel.id
                        tempConfig.category = channel.parentId
                    }
                    if(selectedOption === 'category'){
                        const channel = questionAnswer.mentions.channels.first() || interaction.guild.channels.cache.get(questionAnswer.content)
                        if(!channel || channel.type !== "GUILD_CATEGORY") return oneforall.functions.tempMessage(interaction, lang.tempvoc.invalidChannel('category'))
                        questionAnswer.content = channel.id
                    }
                    tempConfig[selectedOption] = questionAnswer.content
                    updateEmbed()
            }

        })

        async function generateQuestion(question) {
            const messageQuestion = await interaction.channel.send(question)
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

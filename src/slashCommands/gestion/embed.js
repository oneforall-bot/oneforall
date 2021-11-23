const {MessageActionRow, MessageSelectMenu} = require("discord.js"),
    colorNameToHex = require("colornames"),
    fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports = {
    data: {
        name: `embed`,
        description: `Allows you to create embeds`,
        options: [
            {
                name: "amount",
                description: "Amount of needed embeds",
                required: false,
                type: "INTEGER"
            }
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("EMBED_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission)
            return interaction.editReply({
                content: lang.notEnoughPermissions('embed')
            });
        const numberOfEmbed = interaction.options.get('amount') ? interaction.options.get('amount').value : 1
        let embeds = []
        let defaultOptions = lang.embedBuilder.baseMenu
        if (numberOfEmbed && numberOfEmbed > 1) {
            if (numberOfEmbed > 10) return interaction.editReply({content: lang.embedBuilder.invalidNumberOfEmbed})
            defaultOptions = []
            for (let i = 0; i < numberOfEmbed; i++) {
                embeds.push({
                    description: `Embed ${i + 1}`,
                    author: {},
                    thumbnail: {},
                    image: {},
                    footer: {},
                })
                defaultOptions.push(
                    {
                        label: `Embed ${i + 1}`,
                        value: `embed.${interaction.id}.${i + 1}`,
                        description: `Modifier l'embed: ${i + 1}`,
                        emoji: '⚙️'
                    }
                )
            }
        } else {
            embeds.push({
                description: `Embed 1`,
                author: {},
                thumbnail: {},
                image: {},
                footer: {},
            })
        }
        let tempCopy = {}
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`embed.${interaction.id}`)
                    .setPlaceholder('Create your embed')
                    .addOptions(defaultOptions)
            )

        const componentFilter = {
                filter: embedInteraction => embedInteraction.customId === `embed.${interaction.id}` && embedInteraction.user.id === interaction.user.id,
                time: 900000
            },
            awaitMessageFilter = {
                filter: response => response.author.id === interaction.user.id,
                time: 900000,
                limit: 1,
                max: 1,
                errors: ['time']
            }
        const panel = await interaction.editReply({components: [row], embeds})
        const collector = interaction.channel.createMessageComponentCollector(componentFilter);
        let selectedEmbed = 0
        collector.on('collect', async (embedInteraction) => {
            const selectedOption = embedInteraction.values[0]
            if (numberOfEmbed > 1 && selectedOption.split('.')[2]) {
                selectedEmbed = selectedOption.split('.')[2] - 1
                row.components[0].options = [...lang.embedBuilder.baseMenu, {
                    label: 'Back',
                    value: 'back',
                    description: 'Go to back to the embed selector',
                    emoji: '↩'
                }]
                await panel.edit({components: [row]})
                return embedInteraction.deferUpdate()
            }
            const menuSelected = lang.embedBuilder.baseMenu.find(options => options.value === selectedOption) || lang.embedBuilder.footerOptions.find(options => options.value === selectedOption) || lang.embedBuilder.authorOptions.find(options => options.value === selectedOption) || lang.embedBuilder.copyOptions.find(options => options.value === selectedOption)
            if (selectedOption.includes('back')) {
                if (selectedOption === 'back')
                    return updateOptions(embedInteraction, 'Select the embed to edit')
                else
                    return updateOptions(embedInteraction, 'Create your embed', !numberOfEmbed || numberOfEmbed === 1 ? lang.embedBuilder.baseMenu : [...lang.embedBuilder.baseMenu, {
                        label: 'Back',
                        value: 'back',
                        description: 'Go to back to the embed selector',
                        emoji: '↩'
                    }])

            }
            if (menuSelected.questionOnly) {
                await embedInteraction.deferUpdate()
                const questionAnswer = await generateQuestion(menuSelected.question)
                if (questionAnswer.content.toLowerCase() === 'cancel') {
                    delete questionAnswer.content
                }
                if (menuSelected.value === 'color') {
                    const color = colorNameToHex(questionAnswer.content.toLowerCase()) || oneforall.functions.hexColorCheck(questionAnswer.content)
                    if (!color) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorColor)
                    questionAnswer.content = color
                }
                if (menuSelected.value === 'thumbnail' || menuSelected.value === 'image') {
                    if (questionAnswer.attachments.size > 0) {
                        const imgData = await uploadImage(questionAnswer.attachments.first().url)
                        questionAnswer.content = {url: imgData.data.link}
                    } else if (questionAnswer.content) {
                        if (!questionAnswer.content.includes('i.imgur.com') && !questionAnswer.content.includes('tenor.com')) {
                            const imgData = await uploadImage(questionAnswer.content)
                            questionAnswer.content = {url: imgData.data.link}
                        }
                        questionAnswer.content = {url: questionAnswer.content}
                    }
                }
                if (menuSelected.value !== 'send') {
                    embeds[selectedEmbed][`${menuSelected.value}`] = questionAnswer.content
                    updateEmbed()
                } else {
                    const channel = questionAnswer.mentions.channels.first() || interaction.guild.channels.cache.get(questionAnswer.content)
                    if (!channel && channel.deleted) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorChannel)
                    await channel.send({embeds})
                    collector.stop()
                    oneforall.functions.tempMessage(interaction, `Embed(s) sent in ${channel.toString()}`)
                    return await panel.delete()
                }
            } else {
                if (menuSelected.value === 'footer' || menuSelected.value === 'copy' || menuSelected.value === 'author') {
                    return updateOptions(embedInteraction, lang.embedBuilder[`${selectedOption}Placeholder`], lang.embedBuilder[`${selectedOption}Options`])
                }
                await embedInteraction.deferUpdate()
                if (selectedOption === 'copy-valid') {
                    if (!tempCopy.channel) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorChannel)
                    const channel = interaction.guild.channels.cache.get(tempCopy.channel)
                    const fetchMessage = await channel.messages.fetch(tempCopy.message)
                    if (!fetchMessage) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorWrongId)
                    if (fetchMessage.embeds) {
                        embeds = fetchMessage.embeds
                    }
                    return updateEmbed()
                }
                const indexToChange = menuSelected.value.split('-')
                const questionAnswer = await generateQuestion(menuSelected.question)
                if (questionAnswer.content.toLowerCase() === 'cancel') {
                    delete questionAnswer.content
                }
                if (indexToChange[1].includes('icon_url')) {
                    if (questionAnswer.attachments.size > 0) {
                        const imgData = await uploadImage(questionAnswer.attachments.first().url)
                        questionAnswer.content = imgData.data.link
                    } else if (questionAnswer.content) {
                        if (!questionAnswer.content.includes('i.imgur.com') && !questionAnswer.content.includes('tenor.com')) {
                            const imgData = await uploadImage(questionAnswer.content)
                            questionAnswer.content = imgData.data.link
                        }

                    }
                }
                if (indexToChange[1].includes('url')) {
                    if (!questionAnswer.content.toLowerCase().startsWith('http') && !questionAnswer.content.toLowerCase().startsWith('https')) return oneforall.functions.tempMessage(message, lang.embedBuilder.errorUrl)
                }
                if (!selectedOption.includes('copy')) {
                    embeds[`${selectedEmbed}`][indexToChange[0]][indexToChange[1]] = questionAnswer.content
                    updateEmbed()
                } else {
                    if (selectedOption === 'copy-channel') {
                        const channel = questionAnswer.mentions.channels.first() || interaction.guild.channels.cache.get(questionAnswer.content)
                        if (!channel && !channel.isText()) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorChannel)
                        tempCopy.channel = channel.id
                    }
                    if (selectedOption === 'copy-id') {
                        if (!tempCopy.channel) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorChannel)
                        const channel = embedInteraction.guild.channels.cache.get(tempCopy.channel)
                        if (isNaN(questionAnswer.content)) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorWrongId)
                        const fetchMessage = await channel.messages.fetch(questionAnswer.content)
                        if (!fetchMessage) return oneforall.functions.tempMessage(interaction, lang.embedBuilder.errorWrongId)
                        tempCopy.message = fetchMessage.id
                    }

                }
            }
        })

        function updateOptions(embedInteraction, placeholder, options = defaultOptions) {
            row.components[0].spliceOptions(0, row.components[0].options.length, options).setPlaceholder(placeholder)
            return embedInteraction.update({components: [row]})
        }

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
            panel.edit({
                embeds
            })
        }

        async function uploadImage(image) {
            const request = await fetch(`https://api.imgur.com/3/upload/`, {
                "credentials": "include",
                "headers": {
                    "accept": "*/*",
                    "authorization": "Client-ID f09340971a82a72",
                },
                "referrerPolicy": "no-referrer-when-downgrade",
                'body': `${image}`,
                "method": "POST",
            })
            return request.json()
        }


    }
}

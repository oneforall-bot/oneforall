const {MessageActionRow, MessageButton} = require("discord.js");
module.exports = {
    data: {
        name: 'help',
        description: 'Get the help',
        options: [
            {
                type: 'STRING',
                description: 'A specific command to get help for',
                name: 'command',
            }
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const {options} = interaction
        let command = oneforall.handlers.slashCommandHandler.slashCommandList.get(options?.getString("command")?.toLowerCase())
        await interaction.deferReply({ephemeral: true})
        if (!command)
            return interaction.editReply({content: 'Command not found'})
        command = {...command.data}
        let embed = {
            footer: {
                icon_url: interaction.user.displayAvatarURL({dynamic: true}) || ''
            },
            timestamp: new Date(),
            color: '#393B48',

        }
        if (command) {
            embed.title = 'Help for the command' + command.name
            embed.fields = [
                {
                    name: 'Name:',
                    value: command.name,
                    inline: true
                },
                {
                    name: 'Description:',
                    value: command.description,
                    inline: true
                },
            ]
            if (command.options)
                embed.fields.push({
                    name: 'Options:',
                    value: command.options.map(option => `${option.name} - ${option.description} - Required: ${option.required ? '\`✅\`' : '\`❌\`'}`).join('\n')
                })
            await interaction.editReply({embeds: [embed]})

        } else {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`help.left.${interaction.id}`)
                        .setEmoji('◀️')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`help.cancel.${interaction.id}`)
                        .setEmoji('❌')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`help.right.${interaction.id}`)
                        .setEmoji('➡️')
                        .setStyle('SECONDARY')
                )
            const componentFilter = {
                filter: interactionList => interactionList.customId.includes(`help`) && interactionList.customId.includes(interaction.id) && interactionList.user.id === interaction.user.id,
                time: 900000
            }
            const allCommands = oneforall.handlers.slashCommandHandler.slashCommandList.concat(oneforall.handlers.commandHandler.commandList)
            let page = 0
            let slicerIndicatorMin = 0,
                slicerIndicatorMax = 10,
                maxPerPage = 10,
                totalPage = Math.ceil(allCommands.size / maxPerPage)
            const embedPageChanger = (page) => {
                const tmp = new oneforall.Collection(Array.from(allCommands).slice(slicerIndicatorMin, slicerIndicatorMax))
                embed.description = tmp.map((command) => `**Name:** ${command?.name || command.data.name}\n**Description:** ${command?.description || command.data.description}\n**Slash:** ${command.data ? '\`✅\`' : '\`❌\`'}`).join('\n\n')
                embed.footer.text = `Help・ Page ${page + 1} / ${totalPage}`
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
            console.log(embedPageChanger(page))
            embed.title = 'Help for all commands'
            await interaction.editReply({embeds: [embedPageChanger(page)], components: [row]})
        }


    }
}

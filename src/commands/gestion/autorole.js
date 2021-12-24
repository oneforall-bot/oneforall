const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "autorole",
    aliases: [],
    description: "Manage autoroles | Gerer les autoroles",
    usage: "autorole",
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    ofaPerms: ["AUTOROLE_CMD"],
    cooldown: 1000,
    /**
    *
    * @param {OneForAll} oneforall
    * @param {Message} message
    * @param {Collection} memberData
    * @param {Collection} guildData
    * @param {[]} args
    */
    run: async (oneforall, message, guildData, memberData, args) => {
        const lang = guildData.langManager
        const autoRoles = guildData.autoroles
        const numberOfAutoroles = autoRoles.length
        const embed = (autoRoleData) => {
            return {
                title: 'Autoroles',
                fields: !autoRoleData ? autoRoles.map((autoRole, i) => {
                    return {
                        name: `\`${i + 1}\` - ${message.guild.roles.cache.get(autoRole.role)?.name || autoRole.role}`,
                        value: `${autoRole.addAfter} - Enable: ${autoRole.enable ? '\`✅\`' : '\`❌\`'}`
                    }
                }) : [
                    {
                        value: message.guild.roles.cache.get(autoRoleData?.role)?.toString() || lang.undefined,
                        name: 'Role:',
                    },
                    {
                        value: (autoRoleData?.enable ? '\`✅\`' : '\`❌\`') || lang.undefined,
                        name: 'Enable:',
                    },
                    {
                        value: autoRoleData?.addAfter || lang.undefined,
                        name: 'Add after:',
                    },
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: message.author.displayAvatarURL({ dynamic: true }) || '',
                    text: 'Autoroles'
                },
                ...oneforall.embed(guildData)
            }
        }
        let defaultOptions = lang.autorole.baseMenu
        let tempAutoRole = { enable: false }
        if (numberOfAutoroles > 0) defaultOptions = [...autoRoles.map((autoRole, i) => {
            return {
                label: `Autorole \`${i + 1}\``,
                value: `autorole.${message.id}.${i + 1}`,
                description: `Modifier l'autorole: ${i + 1}`,
                emoji: '⚙️'
            }
        }), {
            label: 'Create a autorole',
            value: `create`,
            description: 'Créer un autorole',
            emoji: '✨'
        }]
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`autorole.${message.id}`)
                .setOptions(defaultOptions)
                .setPlaceholder('Manage your autoroles')
        )
        const panel = await message.channel.send({ embeds: [embed()], components: [row] })
        const componentFilter = {
            filter: interaction => interaction.customId === `autorole.${message.id}` && interaction.user.id === message.author.id,
            time: 900000
        },
            awaitMessageFilter = {
                filter: response => response.author.id === message.author.id,
                time: 900000,
                limit: 1,
                max: 1,
                errors: ['time']
            }
        const collector = message.channel.createMessageComponentCollector(componentFilter);
        let selectedAutorole = 0
        let editing = false
        collector.on('collect', async (interaction) => {
            const selectedOption = interaction.values[0]
            interaction.deferUpdate()
            if (numberOfAutoroles >= 1 && selectedOption.split('.')[2]) {
                selectedAutorole = selectedOption.split('.')[2] - 1
                tempAutoRole = autoRoles[selectedAutorole]
                editing = true
                row.components[0].setOptions([...lang.autorole.baseMenu, {
                    label: 'Back',
                    value: 'back',
                    description: 'Go to back to the autorole selector',
                    emoji: '↩'
                }])
                updateEmbed()
                return await panel.edit({ components: [row] })
            }
            const selectMenu = lang.autorole.baseMenu.find(options => options.value === selectedOption)
            switch (selectedOption) {
                case 'create':
                    tempAutoRole = { enable: false }

                    updateEmbed()
                    updateOptions(interaction, 'Configure your autorole', [
                        ...lang.autorole.baseMenu, {
                            label: 'Back',
                            value: 'back',
                            description: 'Go to back to the autorole selector',
                            emoji: '↩'
                        }
                    ])
                    break
                case 'save':
                    if (!tempAutoRole.role || !tempAutoRole.addAfter) return oneforall.functions.tempMessage(message, lang.autorole.notAllOptions)
                    if (!editing)
                        guildData.autoroles.push(tempAutoRole)
                    else
                        guildData.autoroles[selectedAutorole] = tempAutoRole
                    guildData.save().then(() => oneforall.functions.tempMessage(message,  lang.save ))
                    break
                case 'back':
                    tempAutoRole = undefined
                    updateOptions(interaction, 'Select the autorole to edit')
                    break
                case 'enable':
                    tempAutoRole.enable = !tempAutoRole.enable
                    updateEmbed()

                    break
                default:
                    const questionAnswer = await generateQuestion(selectMenu.question)
                    if (selectedOption === 'role') {
                        const role = questionAnswer.mentions.roles.first() || message.guild.roles.cache.get(questionAnswer.content)
                        if (!role || role.id === message.guild.roles.everyone.id) return oneforall.functions.tempMessage(message, lang.reactrole.roleNotValid)
                        if (role.managed) return oneforall.functions.tempMessage(message, lang.managedRole)
                        if (oneforall.functions.roleHasSensiblePermissions(role.permissions)) return oneforall.functions.tempMessage(message, lang.tryToPermsRole)
                        questionAnswer.content = role.id
                    }
                    if (selectedOption === 'addAfter') {
                        if (!oneforall.functions.isValidTime(questionAnswer.content)) return oneforall.functions.tempMessage(message, lang.antiraid.limit.errorAntiDc)
                    }
                    tempAutoRole[selectedOption] = questionAnswer.content
                    updateEmbed()
                    break
            }


        })

        function updateOptions(interaction, placeholder, options = defaultOptions) {
            row.components[0].setOptions(options).setPlaceholder(placeholder)
            return panel.edit({ embeds: [embed(tempAutoRole)], components: [row] })
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

        function updateEmbed() {
            panel.edit({
                embeds: [embed(tempAutoRole)]
            }).catch(console.log)
        }

    }
}

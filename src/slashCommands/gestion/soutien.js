const {MessageActionRow, MessageSelectMenu} = require("discord.js");
const soutienCheck = require('../../utils/check/soutien')
module.exports = {
    data: {
        name: `soutien`,
        description: `Allows you to configure soutien`,
        options: [
            {
                name: 'count',
                type: 'SUB_COMMAND',
                description: 'Get the number of soutien',
            },
            {
                name: 'config',
                type: 'SUB_COMMAND',
                description: 'Configure the soutien'
            },
        ],
    },

    run: async (oneforall, interaction, memberData, guildData) => {
        const chosenCommand = interaction.options._subcommand
        const lang = guildData.langManager
        const {soutien} = guildData
        if (chosenCommand === 'count') {
            const hasPermission = memberData.permissionManager.has("SOUTIEN_COUNT_CMD");

            await interaction.deferReply({ephemeral: (!!!hasPermission)});
            if(!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions('soutien count')})

            if(!soutien.enable && !soutien.role){
                return interaction.editReply({ephemeral: true, content: lang.soutien.count.noInformation})
            }
            const fetchMembers = await interaction.guild.members.fetch()
            const memberWithSoutien = fetchMembers.filter(member => member.roles.cache.has(soutien.role))
            return interaction.editReply({ephemeral: true, content: lang.soutien.count.number(memberWithSoutien.size)})
        }
        if (chosenCommand === 'config') {
            const hasPermission = memberData.permissionManager.has("SOUTIEN_CONFIG_CMD");
            await interaction.deferReply({ephemeral: (!!!hasPermission)});
            if(!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions('soutien config')})
            const tempSoutien = {...soutien}
            const embed = () => {
                return {
                    description: '**Soutien configuration**',
                    fields: [
                        {
                            name: 'Role',
                            value: tempSoutien.role ? `<@&${tempSoutien.role}>` : lang.undefined,
                        },
                        {
                            name: 'Message',
                            value: tempSoutien.message  ? tempSoutien.message : lang.undefined,
                        },
                        {
                            name: 'Enable',
                            value: tempSoutien.enable ? '✅' : '❌'
                        }
                    ],
                    ...oneforall.embed(guildData)
                }
            }
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setPlaceholder(lang.soutien.config.placeholder)
                        .setCustomId(`soutien.${interaction.id}`)
                        .addOptions(lang.soutien.config.baseMenu(tempSoutien.enable))
                )

            const panel = await interaction.editReply({embeds: [embed()], components: [row]})
            const componentFilter = {
                    filter: interactionSoutien => interactionSoutien.customId === `soutien.${interaction.id}` && interactionSoutien.user.id === interaction.user.id,
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
            collector.on('collect', async (interactionSoutien) => {
                await interactionSoutien.deferUpdate()
                const selectedOption = interactionSoutien.values[0]
                const selectMenu = lang.soutien.config.baseMenu(tempSoutien.enable).find(option => option.value === selectedOption)
                if (selectMenu.question) {
                    const questionAnswer = await generateQuestion(selectMenu.question)
                    if (selectedOption === 'role') {
                        const role = questionAnswer.mentions.roles.first() || interaction.guild.roles.cache.get(questionAnswer.content)
                        if (!role || role.id === interaction.guild.roles.everyone.id) return oneforall.functions.tempMessage(interaction, lang.soutien.config.roleError)
                        if (oneforall.functions.roleHasSensiblePermissions(role.permissions)) return oneforall.functions.tempMessage(interaction, lang.tryToPermsRole)
                        tempSoutien.role = role.id
                    }
                    if (selectedOption === 'message') {
                        if(questionAnswer.content.length > 128) return oneforall.functions.tempMessage(interaction, lang.soutien.config.messageLength)
                        tempSoutien.message = questionAnswer.content
                    }
                }

                if (selectedOption === 'enable') {
                    tempSoutien.enable = !tempSoutien.enable

                }
                if (selectedOption === 'save') {
                    await soutienCheck(oneforall)
                    return guildData.set('soutien', tempSoutien).save().then(() => {
                        panel.delete()
                        oneforall.functions.tempMessage(interaction, lang.save)
                    })
                }
                return updateEmbed()
            })

            function updateEmbed() {
                row.components[0].options = lang.soutien.config.baseMenu(tempSoutien.enable)
                panel.edit({embeds: [embed()], components: [row]})
            }

            async function generateQuestion(question) {
                const messageQuestion = await interaction.channel.send(question)
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                }).catch(() => {})
                const collected = await messageQuestion.channel.awaitMessages(awaitMessageFilter)
                await messageQuestion.delete()
                await collected.first().delete()
                row.components[0].setDisabled(false)
                await panel.edit({
                    components: [row]
                })
                return collected.first()
            }
        }

    }
}

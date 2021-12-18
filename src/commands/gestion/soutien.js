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

    run: async (oneforall, message, memberData, guildData) => {
        const chosenCommand = message.options._subcommand
        const lang = guildData.langManager
        const {soutien} = guildData
        if (chosenCommand === 'count') {
            const hasPermission = memberData.permissionManager.has("SOUTIEN_COUNT_CMD");

            await message.deferReply({ephemeral: (!!!hasPermission)});
            if(!hasPermission) return message.editReply({content: lang.notEnoughPermissions('soutien count')})

            if(!soutien.enable && !soutien.role){
                return message.editReply({ephemeral: true, content: lang.soutien.count.noInformation})
            }
            const fetchMembers = await message.guild.members.fetch()
            const memberWithSoutien = fetchMembers.filter(member => member.roles.cache.has(soutien.role))
            return message.editReply({ephemeral: true, content: lang.soutien.count.number(memberWithSoutien.size)})
        }
        if (chosenCommand === 'config') {
            const hasPermission = memberData.permissionManager.has("SOUTIEN_CONFIG_CMD");
            await message.deferReply({ephemeral: (!!!hasPermission)});
            if(!hasPermission) return message.editReply({content: lang.notEnoughPermissions('soutien config')})
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
                        .setCustomId(`soutien.${message.id}`)
                        .addOptions(lang.soutien.config.baseMenu(tempSoutien.enable))
                )

            const panel = await message.editReply({embeds: [embed()], components: [row]})
            const componentFilter = {
                    filter: messageSoutien => messageSoutien.customId === `soutien.${message.id}` && messageSoutien.user.id === message.author.id,
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
            collector.on('collect', async (messageSoutien) => {
                await messageSoutien.deferUpdate()
                const selectedOption = messageSoutien.values[0]
                const selectMenu = lang.soutien.config.baseMenu(tempSoutien.enable).find(option => option.value === selectedOption)
                if (selectMenu.question) {
                    const questionAnswer = await generateQuestion(selectMenu.question)
                    if (selectedOption === 'role') {
                        const role = questionAnswer.mentions.roles.first() || message.guild.roles.cache.get(questionAnswer.content)
                        if (!role || role.id === message.guild.roles.everyone.id) return oneforall.functions.tempMessage(message, lang.soutien.config.roleError)
                        if (oneforall.functions.roleHasSensiblePermissions(role.permissions)) return oneforall.functions.tempMessage(message, lang.tryToPermsRole)
                        tempSoutien.role = role.id
                    }
                    if (selectedOption === 'message') {
                        if(questionAnswer.content.length > 128) return oneforall.functions.tempMessage(message, lang.soutien.config.messageLength)
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
                        oneforall.functions.tempMessage(message, lang.save)
                    })
                }
                return updateEmbed()
            })

            function updateEmbed() {
                row.components[0].options = lang.soutien.config.baseMenu(tempSoutien.enable)
                panel.edit({embeds: [embed()], components: [row]})
            }

            async function generateQuestion(question) {
                const messageQuestion = await message.channel.send(question)
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

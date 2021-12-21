const {MessageActionRow, MessageSelectMenu} = require("discord.js");
const soutienCheck = require('../../utils/check/soutien')
const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "soutien",
   aliases: ["status-role"],
   description: "Configure or get the soutien | Configurer ou avoir le nombre de soutien",
   usage: "soutien <config/count>",
   clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
   ofaPerms: [],
   guildOwnersOnly: false,
   guildCrownOnly: false,
   ownersOnly: false,
   cooldown: 1500,
  /**
  * 
  * @param {OneForAll} oneforall
  * @param {Message} message 
  * @param {Collection} memberData 
  * @param {Collection} guildData 
  * @param {[]} args
  */
   run: async (oneforall, message, guildData, memberData,args) => {
    const chosenCommand = args[0]
    const lang = guildData.langManager
    const {soutien} = guildData
    if (chosenCommand === 'count') {
        const hasPermission = memberData.permissionManager.has("SOUTIEN_COUNT_CMD");

        if(!hasPermission) return oneforall.functions.tempMessage(message,  lang.notEnoughPermissions('soutien count'))

        if(!soutien.enable && !soutien.role){
            return oneforall.functions.tempMessage(message, lang.soutien.count.noInformation)
        }
        const fetchMembers = await message.guild.members.fetch()
        const memberWithSoutien = fetchMembers.filter(member => member.roles.cache.has(soutien.role))
        return message.channel.send({content: lang.soutien.count.number(memberWithSoutien.size)})
    }
    if (chosenCommand === 'config') {
        const hasPermission = memberData.permissionManager.has("SOUTIEN_CONFIG_CMD");
        if(!hasPermission) return oneforall.functions.tempMessage(message, lang.notEnoughPermissions('soutien config'))
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

        const panel = await message.channel.send({embeds: [embed()], components: [row]})
        const componentFilter = {
                filter: interaction => interaction.customId === `soutien.${message.id}` && interaction.user.id === message.author.id,
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
        collector.on('collect', async (interaction) => {
            await interaction.deferUpdate()
            const selectedOption = interaction.values[0]
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

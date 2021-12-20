const { MessageActionRow, MessageSelectMenu, Message, Collection, Permissions, Snowflake } = require("discord.js");
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "invite",
    aliases: [],
    description: "Manage invites on the server || Gérer les invites sur le serveur",
    usage: "invite [config/add/remove/reset/member] [member] [amount]",
    clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.EMBED_LINKS],
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
        const subCommand = args[0]
        if (!subCommand || subCommand !== "add" && subCommand !== "remove" && subCommand !== "config" && subCommand !== "reset") {
            let user = args[0] ? (await message.guild.members.fetch(args[0]).catch(() => {})) || message.mentions.members.first() : message.member

            if (user) {
                memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${user.id}`, {
                    guildId: message.guild.id,
                    memberId: user.id
                })
            }
            const { invites } = memberData
            return message.channel.send({ embeds: [lang.invite.show(user.user, invites, oneforall.functions.getTotalInvite(invites))] })
        }
        const hasPermission = memberData.permissionManager.has(`INVITE_${subCommand.toUpperCase()}_CMD`) || subCommand === 'show'
        if (!hasPermission) return oneforall.functions.tempMessage(message, lang.notEnoughPermissions(`invite ${subCommand}`))
        if (subCommand === 'config') {
            let { invites } = guildData
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`invite.${message.id}`)
                        .setPlaceholder(lang.invite.config.placeholder)
                        .addOptions(lang.invite.config.selectMenuOptions(invites.enable))
                )


            const embed = {
                title: 'Configuration',
                fields: [
                    {
                        name: 'Channel',
                        value: invites.channel ? `<#${invites.channel}>` : lang.undefined
                    },
                    {
                        name: 'Message',
                        value: invites.message || lang.undefined
                    },
                    {
                        name: 'Enable',
                        value: invites.enable ? '\`✅\`' : '\`❌\`'
                    },
                ],
                ...oneforall.embed(guildData),
                timestamp: new Date()
            }
            const panel = await message.channel.send({
                embeds: [embed], components: [row]
            })
            const componentFilter = {
                filter: messageReactrole => messageReactrole.customId === `invite.${message.id}` && messageReactrole.user.id === message.author.id,
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
                    const questionAnswer = await generateQuestion(lang.invite.config.chQ)
                    if (questionAnswer.content === 'cancel') return errorMessage(lang.cancel)
                    const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content)
                    if (!channel || channel.deleted) return errorMessage(lang.invite.config.invalidChannel)
                    if (!channel.isText()) return errorMessage(lang.invite.config.notText)
                    invites.channel = channel.id
                    await updateEmbed()
                    return errorMessage(lang.invite.config.successCh(channel.toString()))
                }
                if (selectedOption === 'message') {
                    const { content } = await generateQuestion(lang.invite.config.msgQ)
                    if (content === 'cancel') return errorMessage(lang.cancel)

                    invites.message = content
                    await updateEmbed()
                }
                if (selectedOption === 'help') {
                    const helpEmbed = {
                        title: 'Help variables invites',
                        description: lang.invite.config.help,
                        timestamp: new Date()
                    }
                    message.channel.send({ embeds: [helpEmbed] })
                }
                if (selectedOption === 'enable') {
                    invites.enable = !invites.enable
                    row.components[0].options = lang.invite.config.selectMenuOptions(invites.enable)
                    await panel.edit({ components: [row] })
                    await updateEmbed()
                }
                if (selectedOption === 'save') {
                    if (!invites.message) return errorMessage(lang.invite.config.noMsg)
                    if (!invites.channel) return errorMessage(lang.invite.config.noChannel)
                    guildData.save()
                    collector.stop()
                    messageReactrole.deleteReply()
                    errorMessage(lang.invite.config.success)
                    await panel.delete().catch(() => { })

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
                embed.fields[0].value = !invites.channel ? lang.undefined : `<#${invites.channel}>`;
                embed.fields[1].value = invites.message || lang.undefined;
                embed.fields[2].value = !invites.enable ? '\`❌\`' : '\`✅\`'
                await panel.edit({ embeds: [embed] })
            }
        }
        if (subCommand === 'add' || subCommand === 'remove') {
            let amount = isNaN(args[2]) ? undefined : parseInt(args[2])
            if (!amount) return oneforall.functions.tempMessage(message, 'Invalid amount')
            
            const member = args[1] ? (await message.guild.members.fetch(args[1]).catch(() => {})) || message.mentions.members.first() : undefined
            if(!member) return oneforall.functions.tempMessage(message, "Missing member")
            const targetData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${member.id}`, {
                guildId: message.guild.id,
                memberId: member.id
            })
            const { invites } = targetData
            subCommand === 'remove' ? invites.join -= amount : invites.join += amount
            subCommand === 'remove' ? invites.bonus -= amount : invites.bonus += amount
            targetData.save().then(() => {
                oneforall.functions.tempMessage(message, lang.invite.add.success(member.toString(), amount, subCommand))
            })

        }
        if (subCommand === 'reset') {
            let user =args[1] ? (await message.guild.members.fetch(args[1]).catch(() => {})) || message.mentions.members.first() : undefined
            const defaultInvite = { join: 0, leave: 0, fake: 0, bonus: 0 }
            if (user) {
                const targetData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${user.id}`, {
                    guildId: message.guild.id,
                    memberId: user.id
                })

                targetData.invites = defaultInvite
                targetData.save()
            } else {
                const membersInGuild = oneforall.managers.membersManager.filter(memberData => memberData.guildId === message.guild.id)
                if (membersInGuild.size > 0)
                    for (const [key, memberData] of membersInGuild) {
                        memberData.invites = defaultInvite
                        memberData.save()
                    }
            }
            await oneforall.functions.tempMessage(message, lang.invite.reset(user) )

        }
       
    }
}

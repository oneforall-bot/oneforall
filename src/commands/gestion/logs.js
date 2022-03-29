const { Message, Collection, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "setlogs",
    aliases: ["logs"],
    description: "Set the logs on the server | Définir les logs sur le serveur",
    usage: "setlogs",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: ["SETLOGS_CMD"],
    guildOwnersOnly: false,
    guildCrownOnly: false,
    ownersOnly: false,
    cooldown: 0,
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
        const tempLogs = { ...guildData.logs }
        const embed = () => {
            return {
                timestamp: new Date(),
                color: guildData.embedColor,
                title: `Configuration of logs`,
                description: `**Message:** ${tempLogs.message ? `<#${tempLogs.message}>` : 'Non définie'}\n**Moderation:** ${tempLogs.moderation ? `<#${tempLogs.moderation}>` : 'Non définie'}\n**Antiraid:** ${tempLogs.antiraid ? `<#${tempLogs.antiraid}>` : 'Non définie'}\n**Voice:** ${tempLogs.voice ? `<#${tempLogs.voice}>` : 'Non définie'}`,
                footer: {
                    text: `Logs`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true }) || ''
                },
            }
        }
        const componentFilter = {
            filter: interaction => interaction.customId.includes(message.id) && interaction.user.id === message.author.id,
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
        const components = [
            new MessageSelectMenu()
                .setOptions(lang.logs.baseMenu)
                .setPlaceholder('Choose an logs')
                .setCustomId(`logs.${message.id}`),
            new MessageButton()
                .setCustomId(`valid.${message.id}`)
                .setEmoji('✅')
                .setStyle('SECONDARY')
        ]

        const panel = await message.channel.send({ embeds: [embed()], components: components.map(c => new MessageActionRow({ components: [c] })) })
        collector.on('collect', async (interaction) => {
            if (interaction.componentType === 'BUTTON') {
                guildData.logs = tempLogs
                return guildData.save().then(() => {
                    oneforall.functions.tempMessage(message, lang.save)
                    collector.stop()
                    panel.delete()
                })
            }
            await interaction.deferUpdate()
            const selectedOption = interaction.values[0]

            const questionAnswer = await generateQuestion(lang.logs.question)
            const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content);
            if (!channel?.isText()) {
                return oneforall.functions.tempMessage(message, lang.logs.notText)
            }
            tempLogs[selectedOption] = channel.id
            panel.edit({embeds: [embed()]})

        })
        async function generateQuestion(question) {
            const messageQuestion = await message.channel.send(question)
            components[0].setDisabled(true)
            await panel.edit({
                components: components.map(c => new MessageActionRow({ components: [c] }))
            })
            const collected = await messageQuestion.channel.awaitMessages(awaitMessageFilter)
            await messageQuestion.delete()
            await collected.first().delete()
            components[0].setDisabled(false)
            await panel.edit({
                components: components.map(c => new MessageActionRow({ components: [c] }))
            })
            return collected.first()
        }

    }
}
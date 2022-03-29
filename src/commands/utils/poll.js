const ms = require('ms')
const moment = require('moment')
const { MessageActionRow, MessageButton} = require("discord.js");

const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "poll",
   aliases: ["vote"],
   description: "Add, delete or list the polls on the server | Créer, supprimer ou lister les votes sur le serveur",
   usage: "poll <create/delete/list> <channel/messageId> <time> [question] ",
   clientPermissions: ['SEND_MESSAGES'],
   ofaPerms: ["POLL_CMD"],
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
    const subCommand = args[0];

    if(subCommand === 'create'){
        const question = args.slice(3).join(" ")
        const time = args[2]
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
        if(!oneforall.functions.isValidTime(time)) return oneforall.functions.tempMessage(message,  lang.incorrectTime)
        if(!channel || !channel.isText()) return oneforall.functions.tempMessage(message, lang.incorrectChannel)
        if(!question) return oneforall.functions.tempMessage(message, lang.missingQuestion)
        const embed = {
            ...oneforall.embed(guildData),
            title: question,
            description: `${lang.yes}: **0** \`(0%)\`\n\n${lang.no}: **0** \`(0%)\`\n\n Temps restant: <t:${oneforall.functions.dateToEpoch(new Date(moment().add(ms(time)).valueOf()))}:R>`,
            timestamp: moment().add(ms(time)).valueOf()
        }
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(lang.yes)
                    .setCustomId(`poll.yes.${message.id}`)
                    .setStyle('SUCCESS')
            ).addComponents(
                new MessageButton()
                    .setLabel(lang.no)
                    .setCustomId(`poll.no.${message.id}`)
                    .setStyle('DANGER')
            )
        const pollMessage = await channel.send({embeds: [embed], components: [row]})

        guildData.polls.push({question, endAt: moment().add(ms(time)).valueOf(), createdAt: Date.now(), channel: pollMessage.channel.id, id: pollMessage.id, yes: 0, no: 0, alreadyVoted: []})
        guildData.save().then(() => {
            oneforall.functions.tempMessage(message, lang.poll.success(channel.toString()))
        })
    }

    if(subCommand === 'delete'){
        const messageId = args[1]
        if(!messageId) return oneforall.functions.tempMessage(message, lang.poll.delete.missingMessageId)
        const pollToDelete = guildData.polls.find(poll => poll.id === messageId)
        if(!pollToDelete) return oneforall.functions.tempMessage(message, lang.poll.delete.notFound)
        guildData.polls = guildData.polls.filter(poll => poll.id !== messageId)
        guildData.save().then(() => {
            return oneforall.functions.tempMessage(message, lang.poll.delete.success)
        })
    }
}
}

const ms = require('ms'),
    moment = require('moment')
const {MessageActionRow, MessageButton} = require("discord.js");
const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "unmute",
   aliases: [],
   description: "Unmute a member | Unmute un membre",
   usage: "unmute <member>",
   clientPermissions: ['SEND_MESSAGES', "MANAGE_MEMBERS"],
   ofaPerms: ["UNMUTE_CMD"],
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
  
    const member = args[0] ? (await message.guild.members.fetch(args[0]).catch(() => { })) || message.mentions.members.first() : undefined
    if (!member) return oneforall.functions.tempMessage(message, 'Missing member')
    const isMuted = oneforall.managers.mutesManager.has(`${message.guildId}-${member.id}`)
    if (!isMuted) return oneforall.functions.tempMessage(message, lang.mute.remove.notMuted)
    oneforall.managers.mutesManager.getAndCreateIfNotExists(`${message.guildId}-${member.id}`, {
        guildId: message.guildId,
        memberId: member.id
    }).delete()
    member.roles.remove(guildData.mute, `Unmuted by ${message.author.username}#${message.author.discriminator}`).then(() => {
        oneforall.functions.tempMessage(message,  lang.mute.remove.success(`${member.user.username}#${member.user.discriminator}`))
    })
   }
}
const ms = require("ms");
const {Message, Collection, Permissions} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "ban",
   aliases: [],
   description: "Ban a user | Ban un user",
   usage: "ban <member> [reason] [days]",
   clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.BAN_MEMBERS],
   ofaPerms: ["BAN_CMD"],
   cooldown: 1500,
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
    const rawLimit = guildData.antiraid.limit["antiMassBan"].split('/');
    const limit = rawLimit[0]
    const timeBan = ms(rawLimit[1])
    const banMemberData = memberData.antiraidLimits.ban;
    if (!banMemberData.date) banMemberData.date = new Date()
    const diff = new Date() - new Date(banMemberData.date)
    const count = banMemberData.count
    if(diff >= timeBan) banMemberData.count = 0;
    if (banMemberData.count > limit && diff <= timeBan && !oneforall.config.owners.includes(message.author.id)) return oneforall.functions.tempMessage(message,  lang.ban.maxBanAllowedReach)
    if (diff <= timeBan && count <= limit) {
        banMemberData.count++
    }
    banMemberData.date = new Date()
    memberData.save()
    const banOptions = {reason: args.slice(1).join(" ") || `Ban by ${message.author.username}#${message.author.discriminator}`}
    const time = args[2] ? parseInt(args[2]) : undefined
    const member = args[0] ? (await message.guild.members.fetch(args[0]).catch(() => {})) || message.mentions.members.first() : undefined
    console.log(member);
    const user  = !member ? (await oneforall.users.fetch(args[1]).catch(() => {})) : undefined
    if (time) {
        if (time < 0 || time > 7) return message.editReply({content: lang.ban.wrongDays})
        banOptions.days = time.value
    }
    if (oneforall.isOwner(member?.id || user?.id)) return oneforall.functions.tempMessage(message, lang.ban.owner)
    if (member) {
        if(message.guild.ownerId === member.id)  return oneforall.functions.tempMessage(message, lang.ban.owner)
        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
        if (moderationPosition < memberPosition && message.guild.ownerId !== message.author.id && !oneforall.isOwner(message.author.id)) return message.editReply({content: lang.ban.errorRl(member.user.username)})
        member.ban(banOptions).then(() => {
            message.channel.send({embeds: [lang.ban.success(member.toString(), banOptions.reason, message.author.toString())]})
        }).catch(e => {
            console.log(e);
           oneforall.functions.tempMessage(message,  lang.ban.error)
        })
    } else {
        await message.guild.bans.create(user, banOptions).then(() => {
            message.channel.send({embeds: [lang.ban.success(user.toString(), banOptions.reason, message.author.toString())]})
        }).catch(e => {
        })
    }
    const roleLogs = guildData.logs.moderation
    const channel = message.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    if (!channel) return
    channel.send({embeds: [template.guild.ban(message.author, member?.user || user, banOptions.reason)]})

}
}
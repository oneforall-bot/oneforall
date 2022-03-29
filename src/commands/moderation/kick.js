const ms = require("ms");
const { Message, Collection, Permissions } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "kick",
    aliases: [],
    description: "Kick a member | Kick un membre",
    usage: "kick <member> [reason]",
    clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.KICK_MEMBERS],
    ofaPerms: ["KICK_CMD"],
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
        const rawLimit = guildData.antiraid.limit["antiMassKick"].split('/');
        const limit = rawLimit[0]
        const timeBan = ms(rawLimit[1])
        const kickMemberData = memberData.antiraidLimits.kick;
        if (!kickMemberData.date) kickMemberData.date = new Date()
        const diff = new Date() - new Date(kickMemberData.date)
        const count = kickMemberData.count
        if (diff >= timeBan) kickMemberData.count = 0;
        if (kickMemberData.count > limit && diff <= timeBan && !oneforall.config.owners.includes(message.author.id)) return message.editReply({ content: lang.kick.maxKickAllowedReach })
        if (diff <= timeBan && count <= limit) {
            kickMemberData.count++
        }
        kickMemberData.date = new Date()
        memberData.save()
        const reason = args.slice(1).join(" ") || `Kick by ${message.author.username}#${message.author.discriminator}'`
        const member = args[0] ? (await message.guild.members.fetch(args[0]).catch(() => { })) || message.mentions.members.first() : undefined
        if (!member) return oneforall.functions.tempMessage(message, lang.kick.notMember)
        if (oneforall.isOwner(member.id) || message.guild.ownerId === member.id) return oneforall.functions.tempMessage(message, lang.kick.owner)
        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
        if (moderationPosition < memberPosition && message.guild.ownerId !== message.author.id && !oneforall.isOwner(message.author.id)) return oneforall.functions.tempMessage(message, lang.kick.errorRl(member.user.username))
        member.kick(reason).then(() => {
            message.channel.send({ embeds: [lang.kick.success(member.toString(), reason, message.author.toString())] })
        }).catch(e => {
            console.log(e)
            oneforall.functions.tempMessage(message, lang.kick.error)
        })

    }
}

const ms = require('ms'),
    moment = require('moment')
const { MessageActionRow, MessageButton } = require("discord.js");
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "tempmute",
    aliases: [],
    description: "Temporarily mute a member | Mute un membre temporairement",
    usage: "tempmute <member> <time> [reason]",
    clientPermissions: ['SEND_MESSAGES', "MANAGE_MEMBERS"],
    ofaPerms: ["TEMP_MUTE_CMD"],
    guildOwnersOnly: false,
    ownersOnly: false,
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
        const member = args[0] ? (await message.guild.members.fetch(args[0]).catch(() => { })) || message.mentions.members.first() : undefined
        if (!member) return oneforall.functions.tempMessage(message, 'Missing member')
        const reason = args.slice(2).join(" ") || `Muted by ${message.author.username}#${message.author.discriminator}`

        const time = args[1]
        const lang = guildData.langManager
        if (!guildData.setup) return oneforall.functions.tempMessage(message, `Please setup the bot with ${guildData.prefix}setup `)

        const isMuted = oneforall.managers.mutesManager.has(`${message.guildId}-${member?.id}`)
        if (isMuted) return oneforall.functions.tempMessage(message, lang.mute.add.alreadyMuted)

        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId && !oneforall.isOwner(message.author.id)) return message.editReply({ content: lang.roleSuppThanAuthor })
        if (time && !oneforall.functions.isValidTime(time) || !time) return message.editReply({ content: lang.incorrectTime })
        oneforall.managers.mutesManager.getAndCreateIfNotExists(`${message.guildId}-${member.id}`, {
            guildId: message.guildId,
            memberId: member.id,
            expiredAt: moment().utc().add(ms(time), 'millisecond').valueOf(),
            createdAt: new Date(),
            reason,
            authorId: message.author.id
        }).save().then(() => {
            member.timeout(ms(time), reason)
            oneforall.functions.tempMessage(message, lang.mute.add.success(`${member.user.username}#${member.user.discriminator}`, ms(time), reason))

        })

        
    }
}

const { Message, Collection, Permissions } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "bring",
    aliases: ["move"],
    description: "Move a member or all members to a channel || Déplace un membre ou tout les membres dans un salon",
    usage: "bring <channelToBring> [member]",
    clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.MOVE_MEMBERS, Permissions.FLAGS.MANAGE_GUILD],
    ofaPerms: ["BRING_CMD"],
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
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        const member = message.mentions.members.first() || args[1] ? (await message.guild.members.fetch(args[1])) : undefined
        if (!channel || !channel.isVoice()) return message.editReply({ content: lang.bring.notVoice })
        if (member) {
            // if (!member.manageable) return oneforall.functions.tempMessage(message, lang.bring.notManageable)
            if (!member.voice.channel) return oneforall.functions.tempMessage(message, lang.bring.memberNotInChannel)
            await member.voice.setChannel(channel, `Bring by ${message.author.username}#${message.author.discriminator}`)
            return message.reply({ content: lang.bring.successMember(member.toString(), channel.toString()) })
        }
        const channels = message.guild.channels.cache.filter(ch => ch.id !== channel.id && ch.isVoice() && ch.members.size > 0)
        if (channels.size < 1) return oneforall.functions.tempMessage(message, lang.bring.noOneToBring)
        for await (const [_, channelss] of channels)
            for await (const [_, member] of channelss.members) {
                await member.voice.setChannel(channel, `Bring all by ${message.author.username}#${message.author.discriminator}`).catch((e) => {
                    console.log(e)
                })
            }
        return oneforall.functions.tempMessage(message, lang.bring.success(channel.toString()))

    }
}
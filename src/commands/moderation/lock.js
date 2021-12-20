const { Permissions } = require("discord.js");
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "lock",
    aliases: [],
    description: "Open or lock a channel | Ouvre ou ferme un channel",
    usage: "lock <on/off> [channel]",
    clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.MANAGE_CHANNELS],
    ofaPerms: ["LOCK_CMD"],
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
        if (!guildData.setup || !guildData.member) return oneforall.functions.tempMessage(message, lang.noSetup)
        const subCommand = args[0]
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
        if (!channel || !channel.isText()) return
        await channel.permissionOverwrites?.edit(guildData.member, {
            SEND_MESSAGES: subCommand === 'off' ? null : false
        }).then(() => {
            oneforall.functions.tempMessage(message, lang.lock.success(subCommand))
        })

    }
}

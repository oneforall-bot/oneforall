const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "greroll",
    aliases: [],
    description: "Reroll a giveaway",
    usage: "greroll <messageId>",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: ["GIVEAWAY_CMD"],
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
        const messageId = args[0]
        await oneforall.giveawaysManager.reroll(messageId, lang.giveaway.messages).then(() => {
            oneforall.functions.tempMessage(message, lang.giveaway.reroll)
        }).catch(e => {
            oneforall.functions.tempMessage('No giveaway found' )
        })
    }
}
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "gdelete",
    aliases: ["gdel"],
    description: "Delete a giveaway | Supprimer un giveaway",
    usage: "gdelete <messageId>",
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
        await oneforall.giveawaysManager.delete(messageId).then(() => {
            oneforall.functions.tempMessage(message, lang.giveaway.delete)
        }).catch(e => {
            oneforall.functions.tempMessage('No giveaway found')
        })
    }
}
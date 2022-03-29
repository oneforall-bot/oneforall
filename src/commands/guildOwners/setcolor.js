const colorNameToHex = require("colornames");
const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "setcolor",
   aliases: ["colorset", "embedcolor"],
   description: "Change the embed color | Changer la couleur des embeds",
   usage: "setcolor <color>",
   clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],

   guildOwnersOnly: true,
   guildCrownOnly: false,
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
        const color = args[0]
        if(!color) return
        const validColor = colorNameToHex(color.toLowerCase()) || color
        if (!validColor || !oneforall.functions.hexColorCheck(validColor)) return message.reply({
            content: guildData.langManager.set.color.notValid(color)
        })
        guildData.embedColor = validColor
        guildData.save().then(() => {
            message.channel.send({embeds: [guildData.langManager.set.color.success(validColor)]})
        })


    }
}

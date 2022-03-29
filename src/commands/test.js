const {Message, Collection} = require('discord.js')
const OneForAll = require('../structures/OneForAll')
module.exports = {
   name: "test",
   aliases: [],
   description: "",
   usage: "",
   clientPermissions: ['SEND_MESSAGES'],
   ofaPerms: [],
   guildOwnersOnly: false,
   guildCrownOnly: false,
   ownersOnly: false,
   cooldown: 0,
  /**
  * 
  * @param {OneForAll} oneforall
  * @param {Message} message 
  * @param {Collection} memberData 
  * @param {Collection} guildData 
  * @param {[]} args
  */
   run: async (oneforall, message, guildData, memberData, args) => {
        const ch = args[0].replace(/#/, '').slice(1, -1);
        console.log(ch);
   }
}
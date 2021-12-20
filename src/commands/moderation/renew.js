const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "nuke",
   aliases: ["renew"],
   description: "Recreate the channel | Recreer le channel",
   usage: "nuke [channel]",
   clientPermissions: ['SEND_MESSAGES', "MANAGE_CHANNELS"],
   ofaPerms: ["RENEW_CMD"],
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
   run: async(oneforall, message, guildData, memberData, args) => {
    const lang = guildData.langManager
    const position = message.channel.position;
    const rateLimitPerUser = message.channel.rateLimitPerUser;
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
    if(!channel.deletable) return oneforall.functions.tempMessage(message, lang.renew.cannotDelete)
    let newChannel = await channel.clone()
    await message.channel.delete();
    await newChannel.setPosition(position);
    await newChannel.setRateLimitPerUser(rateLimitPerUser)
    const tempMessage = await newChannel.send('s')
    oneforall.functions.tempMessage(tempMessage, lang.renew.success(message.member.toString()))
    tempMessage.delete().catch(() => {})
}
}
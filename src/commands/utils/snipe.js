const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "snipe",
   aliases: [],
   description: "Get the last message delete of a channel | Avoir le dernier message supprimer d'un channel",
   usage: "",
   clientPermissions: ['SEND_MESSAGES'],
   ofaPerms: [],
   guildOwnersOnly: false,
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
   run: async (oneforall, message, memberData, guildData) => {
    const snipedMessage = oneforall.snipes.get(message.channelId)
    if (!snipedMessage) return message.channel.send({content: 'No sniped message', ephemeral: true})
    if (oneforall.functions.isLink(snipedMessage.content)) snipedMessage.content = 'Link ***'
    const embed = new MessageEmbed()
        .setAuthor(snipedMessage.author.tag, snipedMessage.author.displayAvatarURL({dynamic: true, size: 256}))
        .setDescription(snipedMessage.content)
        .setFooter(`${oneforall.user.username} | Date: ${snipedMessage.date}`)
        .setColor(guildData.embedColor)
    if (snipedMessage.image) embed.setImage(snipedMessage.image)
    message.channel.send({embeds: [embed]})
}
}

const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "owner",
   aliases: [],
   description: "Add, remove, list the guild owners | Ajouter, enlever ou lister les owners du serveur",
   usage: "owner <add/remove/list> [member]",
   clientPermissions: ['SEND_MESSAGES', "EMBED_LINKS"],
   guildCrownOnly: true,
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
    const subCommand = args[0]
    const lang = guildData.langManager
    let { guildOwners } = guildData
    const user = args[1] ? (await oneforall.users.fetch(args[1]).catch(() => {})) || message.mentions.users.first() : undefined
    if(subCommand === 'add'){
        const isOwner = guildOwners.includes(user.id)
        if(isOwner) return oneforall.functions.tempMessage(message, lang.owners.add.alreadyOwner)
        guildData.guildOwners.push(user.id)
        guildData.save().then(() => {
            oneforall.functions.tempMessage(message, lang.owners.add.success(user.toString()))
        })
    }
    if(subCommand === 'remove'){
        const isOwner = guildOwners.includes(user.id)
        if(!isOwner) return oneforall.functions.tempMessage(message, lang.owners.remove.notOwner)
        guildData.guildOwners = guildData.guildOwners.filter(id => id !== user.id)
        guildData.save().then(() => {
            oneforall.functions.tempMessage(message, lang.owners.remove.success(user.toString()))
        })
    }
    if(subCommand === 'list'){
        const embedChange = (page, slicerIndicatorMin,  slicerIndicatorMax, totalPage) => {
            return {
                ...oneforall.embed(guildData),
                title: `Owner list (${guildOwners.length})`,
                footer: {
                  text: `Owner Page ${page + 1}/${totalPage ||1}`
                },
                description: guildOwners.map((id, i) => `${i+1} - <@${id}>`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'
            }
        }
        await new oneforall.DataMenu(guildOwners,embedChange, message, oneforall).sendEmbed()
    }
}
}

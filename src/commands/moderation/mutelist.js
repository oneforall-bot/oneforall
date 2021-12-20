const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "mutelist",
    aliases: ["listmute"],
    description: "List the mutes | Listes des membres mutes",
    usage: "mutelist",
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    ofaPerms: ["MUTE_CMD"],
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
        const embedChange = (page, slicerIndicatorMin, slicerIndicatorMax, totalPage) => {
            let i = 0
            return {
                ...oneforall.embed(guildData),
                title: `All admins (${oneforall.managers.mutesManager.size})`,
                footer: {
                    text: `Page ${page + 1}/${totalPage || 1}`
                },
                description: oneforall.managers.mutesManager.map((muteManager) => {
                    i++
                    return `\`${i}\` ・ <@${muteManager.memberId}> ・ Expire  ${!muteManager.expiredAt ? 'Never' : `<t:${oneforall.functions.dateToEpoch(new Date(muteManager.expiredAt))}:R>`} - Reason: \`${muteManager.reason}\` - Author: <@${muteManager.authorId}>`
                }).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

            }
        }
        await new oneforall.DataMenu(oneforall.managers.mutesManager, embedChange, message, oneforall).sendEmbed()
    }
}
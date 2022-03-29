const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "allbots",
    aliases: ["allbot"],
    description: "Display all bots of the server || Affiche les bots du serveur",
    usage: "allbots",
    clientPermissions: ['SEND_MESSAGES', "EMBED_MESSAGES"],
    ofaPerms: ["ALL_CMD"],
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
        const bots = (await message.guild.members.fetch()).filter(member => member.user.bot)
        const embedChange = (page, slicerIndicatorMin, slicerIndicatorMax, totalPage) => {
            let i = 0
            return {
                ...oneforall.embed(guildData),
                title: `All bots (${bots.size})`,
                footer: {
                    text: `Page ${page + 1}/${totalPage || 1}`
                },
                description: bots.mapValues((member) => {
                    i++
                    return `\`${i}\` - ${member.toString()} **(${member.id})**`
                }).toJSON().slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

            }
        }
        await new oneforall.DataMenu(bots, embedChange, message, oneforall).sendEmbed()
    }
}

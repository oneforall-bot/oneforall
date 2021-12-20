const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "alladmins",
    aliases: ["alladmin"],
    description: "Display all admins of the server || Affiche les admins du serveur",
    usage: "alladmins [humans/bot]",
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
        const lang = guildData.langManager
        const bot = args[0] === "bot"
        const admins = (await message.guild.members.fetch()).filter(member => member.permissions.has(8n) && (bot ? true : member.user.bot === false))
        const embedChange = (page, slicerIndicatorMin, slicerIndicatorMax, totalPage) => {
            let i = 0
            return {
                ...oneforall.embed(guildData),
                title: `All admins (${admins.size})`,
                footer: {
                    text: `Page ${page + 1}/${totalPage || 1}`
                },
                description: admins.mapValues((member) => {
                    i++
                    return `\`${i}\` - ${member.toString()} **(${member.id})**`
                }).toJSON().slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

            }
        }
        await new oneforall.DataMenu(admins, embedChange, message, oneforall).sendEmbed()
    
    }
}

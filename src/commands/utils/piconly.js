const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "piconly",
    aliases: ["imgonly", "onlypic"],
    description: "Add, remove or list the piconly on the serveur | Ajouter, supprimer ou lister les piconly sur le serveur",
    usage: "piconly <add/remove/list> [channel]",
    clientPermissions: ['SEND_MESSAGES', "EMBED_LINKS"],
    ofaPerms: ["PICONLY_CMD"],
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
    run: async (oneforall, message, guildData, memberData, args) => {
        const lang = guildData.langManager
        const subCommand = args[0]
        if (subCommand === 'list') {
            const embedChange = (page, slicerIndicatorMin, slicerIndicatorMax, totalPage) => {
                return {
                    ...oneforall.embed(guildData),
                    title: `All piconly channels (${guildData.piconly.length})`,
                    footer: {
                        text: `Page ${page + 1}/${totalPage || 1}`
                    },
                    description: guildData.piconly.map((id, i) => {
                        return `\`${i + 1}\` - <#${id}> **(${id})**`
                    }).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

                }
            }
            return await new oneforall.DataMenu(guildData.piconly, embedChange, message, oneforall).sendEmbed()
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
        if (!channel.isText()) return oneforall.functions.tempMessage(message, lang.piconly.wrongType)
        if (guildData.piconly.includes(channel.id) && subCommand === 'add') return oneforall.functions.tempMessage(message, lang.piconly.alreadyPiconly)
        if (!guildData.piconly.includes(channel.id) && subCommand === 'remove') return oneforall.functions.tempMessage(message, lang.piconly.notPiconly)
        subCommand === 'add' ? guildData.piconly.push(channel.id) : guildData.piconly = guildData.piconly.filter(id => id !== channel.id)
        guildData.save().then(() => {
            oneforall.functions.tempMessage(message, lang.piconly.success(channel.toString()))
        })

    }
}
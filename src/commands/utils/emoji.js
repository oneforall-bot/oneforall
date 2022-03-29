const { Message, Collection, Util, Permissions } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "emoji",
    aliases: [],
    description: "Add or delete emoji || Ajouter ou supprimer des emojis",
    usage: "emoji <add/delete> <emoji> [emojiName]",
    clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS],
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
        const hasPermission = memberData.permissionManager.has("ADD_EMOJI_CMD") || memberData.permissionManager.has("REMOVE_EMOJI_CMD");
        const lang = guildData.langManager
        if (!hasPermission) return oneforall.functions.tempMessage(message, lang.notEnoughPermissions('emoji'))
        const subCommand = args[0]
        if (subCommand !== "add" && subCommand !== "delete") return oneforall.functions.tempMessage(message, "Invalide syntax")
        const rawEmoji = args[1]
        const emoji = Util.parseEmoji(rawEmoji)
        const link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
        if (subCommand === 'add') {
            const hasPermissionAdd = memberData.permissionManager.has("ADD_EMOJI_CMD")
            if (!hasPermissionAdd) return oneforall.functions.tempMessage(message, lang.notEnoughPermissions('emoji add'))
            const name = args[2]
            await message.guild.emojis.create(link, name || emoji.id || emoji.name, { reason: `Emoji add by ${message.author.username}` }).then((emoji) => {
                return oneforall.functions.tempMessage(message, lang.emoji.add.success(emoji.toString()))
            }).catch(() => {
                return oneforall.functions.tempMessage(message, lang.error)
            })
        } else {
            const hasPermissionRemove = memberData.permissionManager.has("REMOVE_EMOJI_CMD")
            if (!hasPermissionRemove) return oneforall.functions.tempMessage(message, lang.notEnoughPermissions('emoji remove'))
            const em = await message.guild.emojis.resolve(emoji.id || emoji.name)
            if (!em) return oneforall.functions.tempMessage(message, lang.error)

            em.delete(`Remove emoji par ${message.author.username}`).then((emoji) => {
                return oneforall.functions.tempMessage(message, lang.emoji.remove.success(emoji.name))
            }).catch(() => {
                return oneforall.functions.tempMessage(message, lang.error)

            })
        }
    }
}
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "setprefix",
    aliases: [],
    description: "Change the prefix",
    usage: "setprefix <new-prefix> ",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: [],
    guildOwnersOnly: true,
    cooldown: 1500,
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
        const newPrefix = args[0]
        let regex = /^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1}$/igm;
        let isValid = regex.test(newPrefix);
        if (!isValid) return message.channel.send(lang.setprefix.errorNoValid)
        guildData.prefix = newPrefix
        guildData.save().then(() => {
            oneforall.functions.tempMessage(message, lang.setprefix.success(newPrefix))
        })
    }
}
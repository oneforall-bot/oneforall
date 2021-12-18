const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "addbot",
    aliases: ["invitebot"],
    description: "Get the invite link of the bot || Avoir l'invite du bot",
    usage: "addbot",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: [],
    cooldown: 0,
    /**
    * 
    * @param {OneForAll} oneforall
    * @param {Message} message 
    * @param {Collection} memberData 
    * @param {Collection} guildData 
    * @param {[]} args
    */
    run: async (oneforall, message, memberData, guildData, args) => {
        message.reply({ content: 'https://discord.com/api/oauth2/authorize?client_id=912445710690025563&permissions=8&scope=bot%20applications.commands'})

    }
}
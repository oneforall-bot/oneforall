const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: 'ping',
    description: 'Show the ping of the bot | Afficher le ping du bot',
    usage: 'ping',
    category: 'utils',
    /**
     * 
     * @param {OneForAll} oneforall 
     * @param {Message} message 
     * @param {Collection} memberData 
     * @param {Collection} guildData 
     * @param {[]} args 
     */
    run: async (oneforall, message, memberData, guildData, args) => {
        message.channel.send("Pinging").then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp; //calculate the ping of the bot
            m.edit({content: `Bot latency: \`${ping}\`ms, WS latency: \`${oneforall.ws.ping}\`ms`});
        })
    }
    
}

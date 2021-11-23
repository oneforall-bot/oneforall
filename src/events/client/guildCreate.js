const { WebhookClient } = require('discord.js')
module.exports = async (oneforall, guild) => {
    const client = await oneforall.users.fetch(oneforall.config.client)
    if(oneforall.guilds.cache.size > oneforall.config.maxGuilds){
        client?.send({content: `Your bot cannot be added in more than ${oneforall.config.maxGuilds} guilds`})
        return guild.leave()

    }
    client?.send({content: oneforall.handlers.langHandler.get('fr').botAdded(guild.name, guild.memberCount, (await oneforall.users.fetch(guild.ownerId)))})
}

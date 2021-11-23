module.exports = async (oneforall, guild) => {
    const client = await oneforall.users.fetch(oneforall.config.client)

    client?.send({content: oneforall.handlers.langHandler.get('fr').botRemoved(guild.name, guild.memberCount, (await oneforall.users.fetch(guild.ownerId)))})

}

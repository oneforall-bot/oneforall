module.exports = async (oneforall, invite) => {
    const {guild} = invite;
    if(guild.me.permissions?.has('MANAGE_GUILD', true)){
        const guildInv = await guild.invites.fetch()
        oneforall.cachedInv.set(guild.id, guildInv)
    }
}

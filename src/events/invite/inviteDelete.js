module.exports = async (oneforall, invite) => {
    const {guild} = invite;
    const guildInv = await guild.invites.fetch()
    for(const [code, invite] of guildInv){
        oneforall.cachedInv.set(code, invite)
    }
    if(guild.vanityURLCode) oneforall.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());
}

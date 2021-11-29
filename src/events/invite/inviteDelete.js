module.exports = async (oneforall, invite) => {
    const {guild} = invite;
    if(guild.me.permissions?.has('MANAGE_GUILD')){
        const guildInv = await guild.invites.fetch()
        for (const [code, invite] of guildInv) {
            oneforall.cachedInv.set(code, invite.uses)
        }
        if (guild.vanityURLCode) oneforall.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());
    }
}

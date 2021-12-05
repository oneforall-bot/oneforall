module.exports = async (oneforall, invite) => {
    const {guild} = invite;
    if(guild.me.permissions?.has('MANAGE_GUILD', true)){
        const guildInv = await guild.invites.fetch()
        const tempMap = new oneforall.Collection()
        for(const [code, invite] of guildInv) tempMap.set(code, invite.uses)
    }
}

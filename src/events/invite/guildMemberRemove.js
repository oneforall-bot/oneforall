module.exports = async (oneforall, member) => {
    const {guild} = member;
    const guildData = await oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    });
    const guildInv = await guild.invites.fetch()
    for (const [code, invite] of guildInv) {
        oneforall.cachedInv.set(code, invite.uses)
    }
    if (guild.vanityURLCode) oneforall.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());
    const userData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`, {
        guildId: guild.id,
        memberId: member.id
    })
    const {invites} = userData;
    if (!invites.invitedBy || member.user.bot) return;
    const invitedByData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${invites.invitedBy}`, {
        guildId: guild.id,
        memberId: invites.invitedBy
    });
    let count = invitedByData.invites;
    count.leave += 1
    invitedByData.invites = count
    invitedByData.save()

}

module.exports = async (oneforall, member) => {
    const {guild} = member;

    if(guild.me.permissions?.has('MANAGE_GUILD', true)){
        const guildInv = await guild.invites.fetch()
        oneforall.cachedInv.set(guild.id, guildInv)
    }

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

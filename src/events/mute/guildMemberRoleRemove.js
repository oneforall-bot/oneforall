module.exports = async (oneforall, member, role) => {
    const {guild} = member;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const isMuted = oneforall.managers.mutesManager.has(`${guild.id}-${member?.id}`)
    if(!guildData.setup || guildData.mute !== role.id || !isMuted) return
    const muteData = oneforall.managers.mutesManager.getAndCreateIfNotExists(`${guild.id}-${member?.id}`, {
        guildId: guild.id,
        memberId: member.id
    })
    muteData.delete()

}

module.exports = async (oneforall, member) => {
    const isMuted = oneforall.managers.mutesManager.has(`${member.guild.id}-${member.id}`)
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(member.guild.id, {
        guildId: member.guild.id,
    })
    if(isMuted){
        member.roles.add(guildData.mute, `Leave muted`).catch(() => {})
    }
}

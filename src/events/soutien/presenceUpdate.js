module.exports = async (oneforall, oldPresence, newPresence) => {
    if(newPresence.status === 'offline') return
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(newPresence.guild.id, {
        guildId: newPresence.guild.id
    })
    const {enable, role, message } = guildData.soutien
    if(!enable && !role && !message) return
    const status = newPresence.activities.find(activity => activity.type === 'CUSTOM')
    const roleToGive = newPresence.guild.roles.cache.get(role)
    if(!roleToGive) return
    if(status && status.state && status.state.toLowerCase().includes(message.toLowerCase())) {
        newPresence.member.roles.add(roleToGive, 'Status on')
    }else{
        newPresence.member.roles.remove(roleToGive, 'status off')
    }


}

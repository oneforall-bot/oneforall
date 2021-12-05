
module.exports = async (oneforall, oldPresence, newPresence) => {
    if(newPresence.status === 'offline') return
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(newPresence.guild.id, {
        guildId: newPresence.guild.id
    })
    const {enable, role, message } = guildData.soutien
    if(!enable && !role && !message) return
    const status = newPresence.activities.find(activity => activity.type === 'CUSTOM')
    const roleToGive = newPresence.guild.roles.cache.get(role)
    if(!roleToGive || roleToGive.position > newPresence.guild.me?.roles.highest.position) return
    if(status?.state?.toLowerCase().includes(message.toLowerCase()) && !newPresence.member.roles.cache.has(roleToGive.id)) {

        newPresence.member.roles.add(roleToGive, 'Status on')
    }else if(newPresence.member.roles.cache.has(roleToGive.id)){
        newPresence.member.roles.remove(roleToGive, 'status off')
    }


}

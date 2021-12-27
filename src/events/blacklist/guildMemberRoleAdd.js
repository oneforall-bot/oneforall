module.exports = async (oneforall, member, role) => {
    const {guild} = member;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    if(!guildData.blacklistRoles?.includes(role.id)) return
    const action = await guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
    if(!action || action.executor.id === oneforall.user.id || oneforall.isGuildOwner(action.executor.id, guildData.guildOwners) || oneforall.isOwner(action.executor.id)) return
    const timeOfAction = action.createdAt.getTime();
    const now = new Date().getTime()
    const diff = now - timeOfAction
    if (diff > 600 || action.changes[0].key !== "$add") return;
    member.roles.remove(role.id, 'Role is in blacklistRoles')
}
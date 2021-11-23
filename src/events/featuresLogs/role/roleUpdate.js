module.exports = async (oneforall, oldRole, newRole) => {
    if(oldRole.rawPosition !== newRole.rawPosition) return;
    if(oldRole.managed) return;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(oldRole.guild.id, {
        guildId: oldRole.guild.id
    })
    const roleLogs = guildData.logs.moderation
    if(!oldRole.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
    const action = await oldRole.guild.fetchAuditLogs({type: "ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
  if(!action || action.executor.id === oneforall.user.id || oneforall.isOwner(action.executor.id)) return
    const channel = oldRole.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    if(!channel) return
    channel.send({embeds : [template.role.update(action.executor, oldRole, newRole)]})
}

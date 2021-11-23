module.exports = async (oneforall, member, role) => {
    if(role.managed) return;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(member.guild.id, {
        guildId: member.guild.id
    })
    const roleLogs = guildData.logs.moderation;
    if(!role.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
    const action = await role.guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
  if(!action || action.executor.id === oneforall.user.id || oneforall.isOwner(action.executor.id)) return
    const channel = role.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs;
    if(!channel) return;
    const timeOfAction = action.createdAt.getTime();
    const now = new Date().getTime();
    const diff = now - timeOfAction;
    if (diff > 600 || action.changes[0].key !== "$remove") return;
    const executor = await member.guild.members.fetch(action.executor.id);
    channel.send({embeds : [template.role.remove(executor, member, role)]});
}

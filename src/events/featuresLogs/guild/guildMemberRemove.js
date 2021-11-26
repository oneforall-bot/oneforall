module.exports = async (oneforall, member) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(member.guild.id, {
        guildId: member.guild.id
    })
    const roleLogs = guildData.logs.moderation
    if(!member.guild.me?.permissions.has("VIEW_AUDIT_LOG")) return
    const action = await member.guild.fetchAuditLogs({type: "MEMBER_KICK"}).then(async (audit) => audit.entries.first());
  if(!action || action.executor.id === oneforall.user.id) return
    const timeOfAction = action.createdAt.getTime();
    const now = new Date().getTime()
    const diff = now - timeOfAction
    if(diff > 1000) return
    const channel = member.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    if(!channel) return
    channel.send({embeds : [template.guild.kick(action.executor, member)]})
}

module.exports = async (oneforall, ch) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(ch.guild.id, {
        guildId: ch.guild.id
    })
    const roleLogs = guildData.logs.moderation
    if(!ch.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
    const action = await ch.guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then(async (audit) => audit.entries.first());
  if(!action || action.executor.id === oneforall.user.id) return
    const channel = ch.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    if(!channel) return
    channel.send({embeds : [template.channel.delete(action.executor, ch)]})
}

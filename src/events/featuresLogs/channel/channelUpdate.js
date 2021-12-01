module.exports = async (oneforall, oldChannel, newChannel) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(oldChannel.guild.id, {
        guildId: oldChannel.guild.id
    })
    const roleLogs = guildData.logs.moderation
    if(!oldChannel.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
    const action = await oldChannel.guild.fetchAuditLogs({type: "CHANNEL_UPDATE"}).then(async (audit) => audit.entries.first());
    if(!action || action.executor.id === oneforall.user.id) return
    const channel = oldChannel.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    const timeOfAction = action.createdAt.getTime();
    const now = new Date().getTime();
    const diff = now - timeOfAction;
    if (diff > 600 ) return;
    if(!channel) return
    channel.send({embeds : [template.channel.update(action.executor, oldChannel, newChannel)]})
}

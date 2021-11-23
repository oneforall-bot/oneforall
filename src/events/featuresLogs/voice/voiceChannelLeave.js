module.exports = async (oneforall, member, ch) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(member.guild.id, {
        guildId: member.guild.id
    })
    const roleLogs = guildData.logs.voice
    if (!member.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
    const action = await member.guild.fetchAuditLogs({type: "MEMBER_DISCONNECT"}).then(async (audit) => audit.entries.first());
    const channel = member.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs

    if (!channel) return
    const timeOfAction = action?.createdAt.getTime();
    const now = new Date().getTime()
    const diff = now - timeOfAction
    if (diff && diff < 1000) {
        const executor = await member.guild.members.fetch(action.executor.id)
        return channel.send({embeds: [template.voice.disconnect(executor, member, ch)]})
    }
    channel.send({embeds: [template.voice.disconnect(member, member, ch)]})

}

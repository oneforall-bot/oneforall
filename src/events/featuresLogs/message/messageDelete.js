module.exports = async (oneforall, message) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(message.guild.id, {
        guildId: message.guild.id
    })
    const messageLogs = guildData.logs.message
    if(!message.author || message.author.bot) return
    if(!messageLogs && !message.guild && message.partial && !message.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
    let action = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        }),
        deletionLog = action.entries.first();
    const channel = message.guild.channels.cache.get(messageLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    if(!channel) return;
    if (!deletionLog) {
        //delete his msg
        return channel.send({embeds: [template.message.delete(message.member, undefined, message.channel, message.content)]})
    }
    const {executor, target} = deletionLog;

    if (target.id === message.author?.id) {
        // delete the message of
        const targetMember =  await message.guild.members.fetch(executor.id).catch(() => {})
        channel.send({embeds: [template.message.delete(message.member, targetMember, message.channel, message.content)]})

    } else {
        //delete his msg
        channel.send({embeds: [template.message.delete(message.member, undefined, message.channel, message.content)]})

    }


}

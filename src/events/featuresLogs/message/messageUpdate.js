module.exports = async (oneforall, oldMessage, newMessage) => {
    if(oldMessage.partial) await oldMessage.fetch()
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(newMessage.guild.id, {
        guildId: newMessage.guild.id
    })
    const messageLogs = guildData.logs.message
    if(newMessage.author?.bot ||oldMessage.author?.bot) return
    if(!messageLogs && !oldMessage.author && !oldMessage.guild && oldMessage.partial && !oldMessage.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
    if(oldMessage.embeds.length < 1 && newMessage.embeds.length > 0) return;
    const channel = newMessage.guild.channels.cache.get(messageLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    if(!channel) return
    const link = `https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`
    const executor = await oldMessage.member.fetch()
    channel.send({embeds : [template.message.update(executor, oldMessage.channel, oldMessage.content, newMessage.content, link)]})

}

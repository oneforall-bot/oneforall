module.exports = async (oneforall, member, ch) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(member.guild.id, {
        guildId: member.guild.id
    })
    const roleLogs = guildData.logs.voice
    const channel = member.guild.channels.cache.get(roleLogs);
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs
    if(!channel) return
    channel.send({embeds : [template.voice.connect(member, ch)]})
}

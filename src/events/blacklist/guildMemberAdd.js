module.exports = async(oneforall, member) => {
    const {guild} = member
    const isBlacklisted = oneforall.managers.blacklistManager.find(v => v.guildId === member.guild.id && member.id === v.userId);
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    if(isBlacklisted){
        member.ban({reason: 'Join when blacklisted'})
        const raidLogs = guildData.logs.antiraid;
        const channelLog = guild.channels.cache.get(raidLogs)
        const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
        const {template} = logs;
        const log = template.guild.blacklist(member.user)
        if(!channelLog || channelLog.deleted) return;
        channelLog.send({embeds: [log]})
    }
}

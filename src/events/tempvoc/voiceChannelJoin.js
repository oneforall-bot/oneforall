module.exports = async (oneforall, member, channel) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(member.guild.id, {
        guildId: member.guild.id
    })
    if(!member.guild.me?.permissions.has("MANAGE_CHANNELS")) return
    const {tempvoc} = guildData
    if (!tempvoc.channel || !tempvoc.enable || !tempvoc.category) return
    if(channel.id !== tempvoc.channel) return
    const category = member.guild.channels.cache.get(tempvoc.category)
    if(!category) return
    const chName = tempvoc.name.replace(/{member}/g, member.user.username)
    member.guild.channels.create(chName, {
        type: 'GUILD_VOICE',
        parent: tempvoc.category,
        reason: 'Vocal temporaire',
    }).then(c => {
        c.permissionOverwrites.create(member, {
            MANAGE_CHANNELS: true,
            MANAGE_ROLES: true,
        });
        // Move user to ch
        member.voice.setChannel(c)
    })

}

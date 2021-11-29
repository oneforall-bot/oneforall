module.exports = async (oneforall, member, channel) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(member.guild.id, {
        guildId: member.guild.id
    })
    const {tempvoc} = guildData
    if (!tempvoc.channel || !tempvoc.enable || !tempvoc.category) return
    if(channel.parentId === tempvoc.category && !channel.members.size && channel.id !== tempvoc.channel){
        channel.delete({reason: `Personne dans le salon`})
    }
}

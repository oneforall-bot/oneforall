module.exports = async (oneforall, message) => {
    if(!message.guild || message.member?.permission.has('ADMINISTRATOR')) return
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(`${message.guild.id}`, {
        guildId: message.guild.id
    })
    const {piconly} = guildData;
    if(piconly.includes(message.channel.id) && message.attachments.size <= 0){
        return message.delete().catch(() => {})
    }
}

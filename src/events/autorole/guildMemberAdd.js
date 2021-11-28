const ms = require('ms')
module.exports = async (oneforall, member) => {
    const {guild} = member
    if(!guild.me.permissions.has("MANAGE_GUILD")) return console.log("Permissions manage member missing")
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const {autoroles} = guildData;
    if(!autoroles.length) return
    for await (const autoRole of autoroles) {
        if(autoRole.enable) {
            const role = guild.roles.cache.get(autoRole.role)
            if(role) {
                setTimeout(() => {
                    member.roles.add(role, `Autorole`)
                }, ms(autoRole.addAfter))
            }
        }
    }
}

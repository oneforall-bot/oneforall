const moment = require('moment')
module.exports = async (oneforall) => {
    console.log('Start checking mute')
    setInterval(async () => {
        const timeMuted = oneforall.managers.mutesManager.filter(muteManager => muteManager.expiredAt)
        if(timeMuted.size < 1) return
        const now = moment().utc()
        const expiredMuted = timeMuted.filter(muteManager => now.isSameOrAfter(moment(muteManager.expiredAt), 'second'))
        if(expiredMuted.size < 1) return
        for await(const [_, mutedExpired] of expiredMuted){
            const guild = oneforall.guilds.cache.get(mutedExpired.guildId)
            if(!guild || !guild.available) return
            const member = await guild.members.fetch(mutedExpired.memberId).catch(() => {})
            if(!member || !member.manageable) return
            const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
                guildId: guild.id
            })
            mutedExpired.delete()
            console.log('Removed mute for', mutedExpired.memberId)
            // await member.roles.remove(guildData.mute, `Auto unmute`)
            console.log('Trying remove role mute ')
        }
    }, 1500)
}

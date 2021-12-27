const cron = require('node-cron')
module.exports = async (oneforall) => {
    console.log('Start checking channels')
    cron.schedule('*/10 * * * *', () => {
        oneforall.managers.guildsManager.filter(manager => manager.counters).forEach(async guildData => {
            for (const key in guildData.counters) {
                if (guildData.counters[key] && guildData.counters[key].name) {
                    const channel = oneforall.channels.cache.get(guildData.counters[key]?.channel)
                    if (channel) {
                        const guild = oneforall.guilds.cache.get(guildData.guildId)
                        if (guild?.available) {

                            console.log('Channel edited on guild' + guild.name)
                            const value = key === 'member' ? guild.memberCount : key === 'voice' ? (await guild.members.fetch()).filter(member => member.voice.channelId).size
                                : key === 'online' ? (await guild.members.fetch({withPresences: true})).filter(member => member.presence?.status === 'online' || member.presence?.status === 'dnd' || member.presence?.status === 'idle').size :
                                    key === 'offline' ? (await guild.members.fetch({withPresences: true})).filter(member => member.presence?.status !== 'online' || member.presence?.status !== 'dnd' || member.presence?.status !== 'idle').size :
                                        key === 'boostCount' ? guild.premiumSubscriptionCount : (await guild.members.fetch()).filter(member => member.premiumSince).size
                            channel.edit({
                                name: `${guildData.counters[key].name.replace('{count}', value.toLocaleString())}`
                            }).catch(() => {})
                        }
                    }
                }
            }
        })
    })
}

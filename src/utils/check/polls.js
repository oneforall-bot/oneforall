module.exports = async (oneforall) => {
    console.log('Start checking polls')
    setInterval(() => {
        oneforall.managers.guildsManager.filter(manager => manager.polls.length > 0).forEach(async guildData => {
            const guild = oneforall.guilds.cache.get(guildData.guildId)
            if(!guild) return
            for (const poll of guildData.polls) {
                if (new Date(poll.endAt) >= new Date()) break
                const channel = guild.channels.cache.get(poll.channel)
                if (!channel) break
                const embed = {
                    ...oneforall.embed(guildData),
                    title: poll.question,
                    description: `Result: \n\n${oneforall.handlers.langHandler.get(guildData.lang).yes}: **${poll.yes}** \`(${((poll.yes / (poll.yes + poll.no)) * 100)?.toFixed(0) | 0}%)\`\n\n${oneforall.handlers.langHandler.get(guildData.lang).no}: **${poll.no}** \`(${((poll.no / (poll.yes + poll.no)) * 100).toFixed(0) | 0}%)\``,
                }
                channel.send({embeds: [embed]})
                const pollMessage = await channel.messages.fetch(poll.id)
                if (pollMessage) pollMessage.edit({components: []}).catch(() => {})
                guildData.polls = guildData.polls.filter(_poll => _poll.id !== poll.id)
                guildData.save()


            }
        })
    }, 1000)
}

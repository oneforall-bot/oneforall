
module.exports = {
    data: {
        name: 'leaderboard',
        description: 'Show different leaderboards',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'invites',
                description: 'Show the invites leaderboard'
            }
        ]
    },

    run: async (oneforall, message, memberData, guildData) => {
        let guildInvites = oneforall.managers.membersManager.filter(memberManager => memberManager.guildId === message.guildId)
        const tempData = []
        guildInvites.forEach(memberManager => {
            tempData.push({memberId: memberManager.memberId, ...memberManager.invites})
        })

        const leaderboard = tempData.sort((a, b) => oneforall.functions.getTotalInvite(b) - oneforall.functions.getTotalInvite(a)).map((memberManager, i) => `\`${i + 1}\` - <@${memberManager.memberId}>: **${oneforall.functions.getTotalInvite(memberManager) || '0'}** invites (**${memberManager.join}** join, **${memberManager.leave}** leave, **${memberManager.fake}** fake, **${memberManager.bonus}** bonus)`).slice(0, 10).join('\n')
        const embed = {
            title: `Top 10 invites on ${message.guild.name}`,
            description: leaderboard,
            color: guildData.embedColor,
            timestamp: new Date()
        }
        await message.reply({embeds: [embed]})

    }
}

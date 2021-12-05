
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

    run: async (oneforall, interaction, memberData, guildData) => {
        let guildInvites = oneforall.managers.membersManager.filter(memberManager => memberManager.guildId === interaction.guildId)
        const tempData = []
        guildInvites.forEach(memberManager => {
            tempData.push({memberId: memberManager.memberId, ...memberManager.invites})
        })

        const leaderboard = tempData.sort((a, b) => b.total - a.total).map((memberManager, i) => `\`${i + 1}\` - <@${memberManager.memberId}>: **${memberManager.total || '0'}** invites (**${memberManager.join}** join, **${memberManager.leave}** leave, **${memberManager.fake}** fake, **${memberManager.bonus}** bonus)`).slice(0, 10).join('\n')
        const embed = {
            title: `Top 10 invites on ${interaction.guild.name}`,
            description: leaderboard,
            color: "#36393E",
            timestamp: new Date()
        }
        await interaction.reply({embeds: [embed]})

    }
}

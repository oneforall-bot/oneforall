module.exports = async (oneforall) => {
    console.log(`Start checking soutien`)
    for(const [id, guildData] of oneforall.managers.guildsManager){
        const {soutien} = guildData
        if(soutien.role && soutien.message){
            const guild = oneforall.guilds.cache.get(id)
            if(guild){
                const members = await guild.members.fetch({withPresences: true})
                const membersWithSoutien = members.filter(member => member.roles.cache.has(soutien.role))
                const memberWithoutStatus = membersWithSoutien.filter(member => !member.presence?.activities.find(activity => activity.type === 'CUSTOM') || !member.presence?.activities.find(activity => activity.type === 'CUSTOM').state?.includes(soutien.message))
                const memberWithStatusButNotRole = members.filter(member => !member.roles.cache.has(soutien.role) && member.presence?.activities.find(activity => activity.type === 'CUSTOM')?.state?.includes(soutien.message))
                if(memberWithoutStatus.size > 0)
                    memberWithoutStatus.forEach(member => {
                        if(member.manageable)
                            if(member.presence?.status === 'online' || member.presence?.status === 'dnd' || member.presence?.status === 'idle')
                                member.roles.remove(soutien.role, `Ready check for non soutien member`).then(() => {
                                    console.log(`Removed soutien role to ${member.user.username}`)
                                })
                    })
                if(memberWithStatusButNotRole.size > 0)
                    memberWithStatusButNotRole.forEach(member => {
                        if(member.manageable)
                            member.roles.add(soutien.role, `Ready check for soutien`).then(() => {
                                console.log(`Added soutien role to ${member.user.username}`)
                            })
                    })
            }

        }
    }
}

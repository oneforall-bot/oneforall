const ms = require('ms')
module.exports = async (oneforall, member) => {
    const {guild} = member;
    if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return console.log("Permissions view audit logs is missing to the client");
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const eventName = "antiToken"
    if (!guildData.antiraid.enable[eventName]) return;
    const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`, {
        guildId: guild.id,
        memberId: member.id
    });
    if (!memberData) return;
    memberData.permissionManager = new oneforall.Permission(oneforall, guild.id, member.id, memberData, guildData);
    const hasPermission = memberData.permissionManager.has(`EVENT_ANTIRAID_${eventName.toUpperCase()}`)
    if (hasPermission) return;
    const sanction = guildData.antiraid.config[eventName]
    const rawLimit = guildData.antiraid.limit[eventName].split('/')

    const limit = rawLimit[0]
    const time = ms(rawLimit[1])
    const { antiToken } = guildData.antiraid.activeLimits
    if(antiToken.date){
        const diff = new Date() - new Date(antiToken.date)
        const counter = antiToken.counter
        if(diff < time && counter < limit){
            antiToken.counter += 1
            antiToken.recentJoined.push(member.id)
            // console.log(antiToken, 'after1')
        }
        if(diff >= time){
            delete antiToken.date;
            antiToken.counter = 0
            antiToken.recentJoined = []
        }
        antiToken.date = new Date()
        guildData.antiraid.activeLimits.antiToken = antiToken
        guildData.save()
        if(counter < limit || diff >= time ) return
    }else{
        antiToken.date = new Date()
        antiToken.counter += 1;
        antiToken.recentJoined.push(member.id)
        // console.log(antiToken, 'after2')

        guildData.antiraid.activeLimits.antiToken = antiToken
        return guildData.save()
    }
    const raidLogs = guildData.logs.antiraid;
    const channelLog = guild.channels.cache.get(raidLogs)
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs;
    const log = template.limit.token(member, rawLimit)
    log.description += `\n Sanction: **${sanction}**`
    if (sanction === 'ban') {
        guild.members.ban(member.id, {days: 7, reason: `oneforall - ${eventName}`}).catch(() => {})
        for await(const id of antiToken.recentJoined) await guild.members.ban(id, {reason: `oneforall - ${eventName}`}).catch(() => {})
    }
    if (sanction === 'kick') {
        guild.members.kick(member.id, `oneforall - ${eventName}`).catch(() => {})
        for await(const id of antiToken.recentJoined) await guild.members.kick(id, {reason: `oneforall - ${eventName}`}).catch(() => {})

    }
    if(sanction === 'unrank'){
        const roleToSet = member.roles.cache.filter(role => !oneforall.functions.roleHasSensiblePermissions(role.permissions))
        if(member.manageable)
           
            member.roles.set(roleToSet, `oneforall - ${eventName}`).catch(() => {})
        if(member.user.bot){
            const {botRole} = member.roles;
            await botRole.setPermissions(0n);
        }
    }
     if (sanction === 'mute') {
        if(!guildData.setup) return
        const mutedRole = guild.roles.cache.get(guildData.mute)
        if(!mutedRole) return

        oneforall.managers.mutesManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`, {
            guildId: guild.id,
            memberId: member.id,
            createdAt: new Date(),
            reason:  `oneforall - ${eventName}`,
            authorId: oneforall.user.id
        }).save().then(() => {
            member.roles.add(guildData.mute, `oneforall - ${eventName}`)
        })
    }
    if(!channelLog || channelLog.deleted) return;
    channelLog.send({embeds: [log]})


}

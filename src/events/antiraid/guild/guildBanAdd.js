const ms = require("ms");
const moment = require("moment");
module.exports = async (oneforall, ban) => {
    const {guild} = ban;
    if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return console.log("Permissions view audit logs is missing to the client");
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const eventName = "antiMassBan"
    if (!guildData.antiraid.enable[eventName]) return;
    const action = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(async (audit) => audit.entries.first());

     if(!action || action.executor.id === oneforall.user.id || oneforall.isGuildOwner(action.executor.id, guildData.guildOwners)) return
    const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${action.executor.id}`, {
        guildId: guild.id,
        memberId: action.executor.id
    });
    if (!memberData) return;
    memberData.permissionManager = new oneforall.Permission(oneforall, guild.id, action.executor.id, memberData, guildData);
    const hasPermission = memberData.permissionManager.has(`EVENT_ANTIRAID_${eventName.toUpperCase()}`)
    if (hasPermission) return;
    const sanction = guildData.antiraid.config[eventName];
    const rawLimit = guildData.antiraid.limit[eventName].split('/');
    const limit = rawLimit[0]
    const time = ms(rawLimit[1])
    let banMemberData = memberData.antiraidLimits.ban
    const raidLogs = guildData.logs.antiraid;
    const channelLog = guild.channels.cache.get(raidLogs)
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs;
    const log = template.guild.ban(action.executor, ban.user, ban.reason || 'No reason provided')
    if (banMemberData.date) {
        const diff = new Date() - new Date(banMemberData.date)
        const count = banMemberData.count
        if (diff <= time && count <= limit) {
            banMemberData.count++
            banMemberData.banned.push(ban.user.id)
        }
        if (diff >= time) {
            banMemberData.banned = [ban.user.id]
            banMemberData.count = 1
        }
        banMemberData.date = new Date()
        if (count < limit || diff >= time) {
            log.description += `\n${count + 1 === limit ? "No ban left before sanction" : `${count + 1}/${limit} before sanction`}`
        } else {
            log.description += `\n Sanction: **${sanction}**`
            if (sanction === 'ban') {
                guild.members.ban(action.executor.id, {days: 7, reason: `oneforall - ${eventName}`}).catch(() => {
                })
                for await(const id of banMemberData.banned) guild.members.unban(id, `oneforall - ${eventName}`)
            }
            if (sanction === 'kick') {
                guild.members.kick(action.executor.id, `oneforall - ${eventName}`).catch(() => {
                })
                for await(const id of banMemberData.banned) guild.members.unban(id, `oneforall - ${eventName}`)

            }
            if (sanction === 'unrank') {
                const memberExecutor = await guild.members.fetch(action.executor.id);
        const roleToSet = memberExecutor.roles.cache.filter(role => !oneforall.functions.roleHasSensiblePermissions(role.permissions) && role.position < guild.me.roles.highest.position)
                if (memberExecutor.manageable)
                    memberExecutor.roles.set(roleToSet, `oneforall - ${eventName}`).catch(() => {
                    })
                if (memberExecutor.user.bot) {
                    const {botRole} = memberExecutor.roles;
                    await botRole.setPermissions(0n);
                }
                for await(const id of banMemberData.banned) guild.members.unban(id, `oneforall - ${eventName}`)

            }
            if (sanction === 'mute') {
                if(!guildData.setup) return
                const mutedRole = guild.roles.cache.get(guildData.mute)
                if(!mutedRole) return
                const memberExecutor = await guild.members.fetch(action.executor.id);

                oneforall.managers.mutesManager.getAndCreateIfNotExists(`${guild.id}-${memberExecutor.id}`, {
                    guildId: guild.id,
                    memberId: memberExecutor.id,
                    createdAt: new Date(),
                    reason:  `oneforall - ${eventName}`,
                    authorId: oneforall.user.id
                }).save().then(() => {
                    memberExecutor.roles.add(guildData.mute, `oneforall - ${eventName}`)
                })
            }
        }

    } else {
        banMemberData.date = new Date()
        log.description += `\n${banMemberData.count + 1 === limit ? "No ban left before sanction" : `${banMemberData.count + 1}/${limit} before sanction`}`
        banMemberData.count++
        banMemberData.banned.push(ban.user.id)
    }
    if (!channelLog || channelLog.deleted) return;
    channelLog.send({embeds: [log]})
    memberData.save()



}

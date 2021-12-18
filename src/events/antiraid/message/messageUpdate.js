const ms = require("ms");
module.exports = async (oneforall, oldMessage, newMessage) => {
    const {guild} = newMessage;
    if (!newMessage.guild) return;
    if (newMessage.webhookId) return;
    if(!oldMessage.author) return
    if(oldMessage.author.id === oneforall.user.id || oneforall.isOwner(oldMessage.author.id)) return
    if (!oneforall.functions.isLink(newMessage.content)) return
    if (!guild.me.permissions.has("MANAGE_MESSAGES")) return console.log("Permissions manage message is missing to the client");
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const eventName = "antiLink"
    if (!guildData.antiraid.enable[eventName]) return;
    const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${newMessage.author.id}`, {
        guildId: guild.id,
        memberId: newMessage.author.id
    });
    if (!memberData) return;
    memberData.permissionManager = new oneforall.Permission(oneforall, guild.id, newMessage.author.id, memberData, guildData);
    const hasPermission = memberData.permissionManager.has(`EVENT_ANTIRAID_${eventName.toUpperCase()}`)
    if (hasPermission) return;
    const rawLimit = guildData.antiraid.limit[eventName].split('/');
    const limit = rawLimit[0];
    const time = ms(rawLimit[1]);
    const {antiLink} = memberData.antiraidLimits
    if (newMessage.deletable)
        newMessage.delete().catch(() => {
        })
    if (antiLink.date) {
        const diff = new Date() - new Date(antiLink.date)
        const count = antiLink.count
        if (diff < time && count < limit) {
            antiLink.count += 1
        }
        if (diff >= time) {
            delete antiLink.date
            antiLink.count = 0
        }
        antiLink.date = new Date()
        memberData.save()
        if (count < limit || diff >= time) return;
    } else {
        antiLink.date = new Date()
        antiLink.count += 1
        return memberData.save()
    }
    const sanction = guildData.antiraid.config[eventName]
    const raidLogs = guildData.logs.antiraid;
    const channelLog = guild.channels.cache.get(raidLogs)
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs;
    const log = template.message.link(newMessage.member, newMessage.channel, newMessage.content)
        log.description += `\n Sanction: **${sanction}**`
    if (sanction === 'ban') {
        guild.members.ban(newMessage.author.id, {days: 7, reason: `oneforall - ${eventName}`}).catch(() => {
        })
    }
    if (sanction === 'kick') {
        guild.members.kick(newMessage.author.id, `oneforall - ${eventName}`).catch(() => {
        })
    }
    if (sanction === 'unrank') {
        const roleToSet = newMessage.member.roles.cache.filter(role => !oneforall.functions.roleHasSensiblePermissions(role.permissions))
        if (newMessage.member.manageable)

            newMessage.member.roles.set(roleToSet, `oneforall - ${eventName}`).catch(() => {
            })
        if (newMessage.member.user.bot) {
            const {botRole} = newMessage.member.roles;
            await botRole.setPermissions(0n);
        }
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


    if (!channelLog || channelLog.deleted) return;
    channelLog.send({embeds: [log]})


}

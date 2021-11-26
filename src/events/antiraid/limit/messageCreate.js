const ms = require('ms'),
    LIMIT = 5,
    TIME = 7000,
    DIFF = 3000,
    spammer = new Map()
const moment = require("moment");
module.exports = async (oneforall, message) => {
    if(!message.guild) return
    const {guild} = message;
    if(message.author.id === oneforall.user.id || oneforall.isOwner(message.author.id)) return

    if (!guild.me.permissions.has("MANAGE_MESSAGES")) return console.log("Permissions manage message is missing to the client");
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const eventName = "antiSpam"
    if (!guildData.antiraid.enable[eventName]) return;
    const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${message.author.id}`, {
        guildId: guild.id,
        memberId: message.author.id
    });
    if (!memberData) return;
    memberData.permissionManager = new oneforall.Permission(oneforall, guild.id, message.author.id, memberData, guildData);
    const hasPermission = memberData.permissionManager.has(`EVENT_ANTIRAID_${eventName.toUpperCase()}`)
    if (hasPermission) return;
    const sanction = guildData.antiraid.config[eventName]
    if(spammer.has(message.author.id)){
        const userData = spammer.get(message.author.id)
        let { lastMessage, timer, msgCount } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        if(difference > DIFF){
            clearTimeout(timer)
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => spammer.delete(message.author.id), TIME)
            spammer.set(message.author.id, userData)
        }else{
            msgCount++
            if (msgCount >= LIMIT){
                const raidLogs = guildData.logs.antiraid;
                const channelLog = guild.channels.cache.get(raidLogs)
                const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
                const {template} = logs;
                const log = template.limit.spam(message.member)
                log.description += `\n Sanction: **${sanction}**`
                if (sanction === 'ban') {
                    guild.members.ban(message.member.id, {days: 7, reason: `oneforall - ${eventName}`}).catch(() => {})
                }
                if (sanction === 'kick') {
                    guild.members.kick(message.member.id, `oneforall - ${eventName}`).catch(() => {})

                }
                if(sanction === 'unrank'){
                    const roleToSet = message.member.roles.cache.filter(role => !oneforall.functions.roleHasSensiblePermissions(role.permissions))
                    if(message.member.manageable)
                        message.member.roles.set(roleToSet, `oneforall - ${eventName}`).catch(() => {})
                    if(message.author.bot){
                        const {botRole} = message.member.roles;
                        await botRole.setPermissions(0n);
                    }
                }
                if (sanction === 'mute') {
                    if(!guildData.setup) return
                    const mutedRole = guild.roles.cache.get(guildData.mute)
                    if(!mutedRole) return

                    oneforall.managers.mutesManager.getAndCreateIfNotExists(`${guild.id}-${message.member.id}`, {
                        guildId: guild.id,
                        memberId: message.member.id,
                        createdAt: new Date(),
                        reason:  `oneforall - ${eventName}`,
                        authorId: oneforall.user.id
                    }).save().then(() => {
                        message.member.roles.add(guildData.mute, `oneforall - ${eventName}`)
                    })
                }
                (await message.channel.messages.fetch({limit: userData.msgCount})).filter(msg => msg.author.id === message.author.id).forEach(message => message.delete())

                if(!channelLog || channelLog.deleted) return;
                channelLog.send({embeds: [log]})
            }else{
                userData.msgCount = msgCount
                spammer.set(message.author.id, userData)
            }
        }
    }else{
        let fn = () => setTimeout(() => spammer.delete(message.author.id), TIME)
        spammer.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: fn
        })
    }



}

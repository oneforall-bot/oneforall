const ms = require("ms");
const moment = require("moment");
module.exports = async (oneforall, member) => {
    const {guild} = member;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const eventName = "antiDc"
    if (!guildData.antiraid.enable[eventName]) return;
    const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`, {
        guildId: guild.id,
        memberId: member.id
    });
    if (!memberData) return;
    memberData.permissionManager = new oneforall.Permission(oneforall, guild.id, member.id, memberData, guildData);
    const hasPermission = memberData.permissionManager.has(`EVENT_ANTIRAID_${eventName.toUpperCase()}`)
    if (hasPermission) return;
    const sanction = guildData.antiraid.config[eventName];
    const limit = ms(guildData.antiraid.limit[eventName]);
    const user = await oneforall.users.fetch(member.id)
    const time = Date.now() - user.createdAt
    const raidLogs = guildData.logs.antiraid;
    const channelLog = guild.channels.cache.get(raidLogs)
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs;
    const log = template.guild.antiDc(member.user, moment(user.createdAt).format("DD/MM/YYYY"), guildData.antiraid.limit[eventName])
    log.description += `\n Sanction: **${sanction}**`
    if (time > limit) return
    await user.send({embeds: [log]}).catch(() => {
    })
    if (sanction === 'ban') {
        guild.members.ban(member.id, {days: 7, reason: `oneforall - ${eventName}`}).catch(() => {
        })
    }
    if (sanction === 'kick') {
        guild.members.kick(member.id, `oneforall - ${eventName}`).catch(() => {
        })
    }
    if (!channelLog || channelLog.deleted) return;
    channelLog.send({embeds: [log]})


}

const ms = require('ms')
module.exports = async (oneforall, member) => {
    const {guild} = member;
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

    const { antiToken } = guildData.antiraid.activeLimits
    if(antiToken.recentJoined.includes(member.id))
        antiToken.recentJoined = antiToken.recentJoined.filter(id => id  !== member.id)
        guildData.save()

}

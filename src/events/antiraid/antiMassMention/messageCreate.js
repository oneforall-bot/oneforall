const ms = require("ms");
const moment = require("moment");
module.exports = async (oneforall, message) => {
    const {guild} = message;
    if (!message.guild) return;
    if (message.webhookId) return;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const eventName = "antiMassMention"
    if(message.author.id === oneforall.user.id || oneforall.isGuildOwner(message.author.id, guildData.guildOwners)) return
    if (!guild.me.permissions.has("MANAGE_MESSAGES")) return console.log("Permissions manage message is missing to the client");
    if (!guildData.antiraid.enable[eventName]) return;
    const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${message.author.id}`, {
        guildId: guild.id,
        memberId: message.author.id
    });
    if (!memberData) return;
    memberData.permissionManager = new oneforall.Permission(oneforall, guild.id, message.author.id, memberData, guildData);
    const hasPermission = memberData.permissionManager.has(`EVENT_ANTIRAID_${eventName.toUpperCase()}`)
    if (hasPermission) return;
    const rawLimit = guildData.antiraid.limit[eventName].split('/');
    const limit = rawLimit[0];
    const time = ms(rawLimit[1]);
    const {mentions} = memberData.antiraidLimits
    const { roles, members } = message.mentions;
    if(roles.size < 1 && members.size < 1) return
    if (mentions.date) {
        const diff = new Date() - new Date(mentions.date)
        const count = mentions.count
        if (diff < time && count < limit) {
            mentions.count += roles.size + members.size
        }
        if (diff >= time) {
            delete mentions.date
            mentions.count = 0
        }
        mentions.date = new Date()
        memberData.save()
        if (count < limit || diff >= time) return;
    } else {
        mentions.date = new Date()
        mentions.count += roles.size + members.size

        return memberData.save()
    }
    const sanction = guildData.antiraid.config[eventName]
    const raidLogs = guildData.logs.antiraid;
    const channelLog = guild.channels.cache.get(raidLogs)
    const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
    const {template} = logs;
    const log = template.message.link(message.member, message.channel, message.content)
    log.description += `\n Sanction: **${sanction}**`
    if (sanction === 'ban') {
        guild.members.ban(message.author.id, {days: 7, reason: `oneforall - ${eventName}`}).catch(() => {
        })
    }
    if (sanction === 'kick') {
        guild.members.kick(message.author.id, `oneforall - ${eventName}`).catch(() => {
        })
    }
    if (sanction === 'unrank') {
        const roleToSet = message.member.roles.cache.filter(role => !oneforall.functions.roleHasSensiblePermissions(role.permissions))
        if (message.member.manageable)
            message.member.roles.set(roleToSet, `oneforall - ${eventName}`).catch(() => {
            })
        if (message.member.user.bot) {
            const {botRole} = message.member.roles;
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
    if (message.channel.deletable) {
        let newChannel = await message.channel.clone({
            reason: `oneforall - ${eventName}`,
            parent: message.channel.parent
        })
        message.channel.delete(`oneforall - ${eventName}`);
        await newChannel.setPosition(message.channel.position)
    }
    if (!channelLog || channelLog.deleted) return;
    channelLog.send({embeds: [log]})


}

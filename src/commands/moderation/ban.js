const ms = require("ms");
module.exports = {
    data: {
        name: 'ban',
        description: 'Ban a user',
        options: [
            {
                type: 'USER',
                required: true,
                name: 'user',
                description: 'User you want to ban'
            },
            {
                type: 'STRING',
                required: false,
                name: 'reason',
                description: "The reason of the ban"
            },
            {
                type: 'INTEGER',
                required: false,
                name: 'time',
                description: 'The number of days of message you want to clear'
            }
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("BAN_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions('ban')})
        const rawLimit = guildData.antiraid.limit["antiMassBan"].split('/');
        const limit = rawLimit[0]
        const timeBan = ms(rawLimit[1])
        const banMemberData = memberData.antiraidLimits.ban;
        if (!banMemberData.date) banMemberData.date = new Date()
        const diff = new Date() - new Date(banMemberData.date)
        const count = banMemberData.count
        if(diff >= timeBan) banMemberData.count = 0;
        if (banMemberData.count > limit && diff <= timeBan && !oneforall.config.owners.includes(message.author.id)) return message.editReply({content: lang.ban.maxBanAllowedReach})
        if (diff <= timeBan && count <= limit) {
            banMemberData.count++
        }
        banMemberData.date = new Date()
        memberData.save()
        const options = message.options
        const banOptions = {reason: options.get('reason') ? options.get('reason').value : `Ban by ${message.author.username}#${message.author.discriminator}`}
        const time = options.get('time')
        const {member, user} = options.get('user')
        if (time) {
            if (time.value < 0 || time.value > 7) return message.editReply({content: lang.ban.wrongDays})
            banOptions.days = time.value
        }
        if (oneforall.isOwner(member.id) || message.guild.ownerId === member.id) return message.editReply({content: lang.ban.owner})
        if (member) {
            const memberPosition = member.roles.highest.position;
            const moderationPosition = message.member.roles.highest.position;
            if (moderationPosition < memberPosition && message.guild.ownerId !== message.author.id && !oneforall.isOwner(message.author.id)) return message.editReply({content: lang.ban.errorRl(member.user.username)})
            member.ban(banOptions).then(() => {
                message.editReply({embeds: [lang.ban.success(user.toString(), banOptions.reason, message.author.toString())]})
            }).catch(e => {
                message.editReply({content: lang.ban.error})
            })
        } else {
            await message.guild.bans.create(user, banOptions).then(() => {
                message.editReply({embeds: [lang.ban.success(user.toString(), banOptions.reason, message.author.toString())]})
            }).catch(e => {
            })
        }
        const roleLogs = guildData.logs.moderation
        const channel = message.guild.channels.cache.get(roleLogs);
        const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
        const {template} = logs
        if (!channel) return
        channel.send({embeds: [template.guild.ban(message.author, member?.user || user, banOptions.reason)]})

    }

}

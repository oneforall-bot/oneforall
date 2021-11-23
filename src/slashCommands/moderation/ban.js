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
    run: async (oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("BAN_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions('ban')})
        const rawLimit = guildData.antiraid.limit["antiMassBan"].split('/');
        const limit = rawLimit[0]
        const timeBan = ms(rawLimit[1])
        const banMemberData = memberData.antiraidLimits.ban;
        if (!banMemberData.date) banMemberData.date = new Date()
        const diff = new Date() - new Date(banMemberData.date)
        const count = banMemberData.count
        if(diff >= timeBan) banMemberData.count = 0;
        if (banMemberData.count > limit && diff <= timeBan && !oneforall.config.owners.includes(interaction.user.id)) return interaction.editReply({content: lang.ban.maxBanAllowedReach})
        if (diff <= timeBan && count <= limit) {
            banMemberData.count++
        }
        banMemberData.date = new Date()
        memberData.save()
        const options = interaction.options
        const banOptions = {reason: options.get('reason') ? options.get('reason').value : `Ban by ${interaction.user.username}#${interaction.user.discriminator}`}
        const time = options.get('time')
        const {member, user} = options.get('user')
        if (time) {
            if (time.value < 0 || time.value > 7) return interaction.editReply({content: lang.ban.wrongDays})
            banOptions.days = time.value
        }
        if (oneforall.isOwner(member.id) || interaction.guild.ownerId === member.id) return interaction.editReply({content: lang.ban.owner})
        if (member) {
            const memberPosition = member.roles.highest.position;
            const moderationPosition = interaction.member.roles.highest.position;
            if (moderationPosition < memberPosition && interaction.guild.ownerId !== interaction.user.id && !oneforall.isOwner(interaction.user.id)) return interaction.editReply({content: lang.ban.errorRl(member.user.username)})
            member.ban(banOptions).then(() => {
                interaction.editReply({embeds: [lang.ban.success(user.toString(), banOptions.reason, interaction.user.toString())]})
            }).catch(e => {
                interaction.editReply({content: lang.ban.error})
            })
        } else {
            await interaction.guild.bans.create(user, banOptions).then(() => {
                interaction.editReply({embeds: [lang.ban.success(user.toString(), banOptions.reason, interaction.user.toString())]})
            }).catch(e => {
            })
        }
        const roleLogs = guildData.logs.moderation
        const channel = interaction.guild.channels.cache.get(roleLogs);
        const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
        const {template} = logs
        if (!channel) return
        channel.send({embeds: [template.guild.ban(interaction.user, member?.user || user, banOptions.reason)]})

    }

}

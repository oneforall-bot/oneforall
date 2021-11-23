const ms = require("ms");
module.exports = {
    data: {
        name: 'kick',
        description: 'Kick a member',
        options: [
            {
                type: 'USER',
                required: true,
                name: 'user',
                description: 'Member you want to kick'
            },
            {
                type: 'STRING',
                required: false,
                name: 'reason',
                description: "The reason of the kick"
            },
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("KICK_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions('kick')})
        const rawLimit = guildData.antiraid.limit["antiMassKick"].split('/');
        const limit = rawLimit[0]
        const timeBan = ms(rawLimit[1])
        const kickMemberData = memberData.antiraidLimits.kick;
        if (!kickMemberData.date) kickMemberData.date = new Date()
        const diff = new Date() - new Date(kickMemberData.date)
        const count = kickMemberData.count
        if(diff >= timeBan) kickMemberData.count = 0;
        if (kickMemberData.count > limit && diff <= timeBan && !oneforall.config.owners.includes(interaction.user.id)) return interaction.editReply({content: lang.kick.maxKickAllowedReach})
        if (diff <= timeBan && count <= limit) {
            kickMemberData.count++
        }
        kickMemberData.date = new Date()
        memberData.save()
        const options = interaction.options
        const reason = options.get('reason')?.value || `Kick by ${interaction.user.username}#${interaction.user.discriminator}'`
        const {member, user} = options.get('user')
        if(!member) return interaction.editReply({content: lang.kick.notMember})
        if (oneforall.isOwner(member.id) || interaction.guild.ownerId === member.id) return interaction.editReply({content: lang.kick.owner})
        const memberPosition = member.roles.highest.position;
        const moderationPosition = interaction.member.roles.highest.position;
        if (moderationPosition < memberPosition && interaction.guild.ownerId !== interaction.user.id && !oneforall.isOwner(interaction.user.id)) return interaction.editReply({content: lang.kick.errorRl(member.user.username)})
        member.kick(reason).then(() => {
            interaction.editReply({embeds: [lang.kick.success(user.toString(), reason, interaction.user.toString())]})
        }).catch(e => {
            console.log(e)
            interaction.editReply({content: lang.kick.error})
        })

    }

}

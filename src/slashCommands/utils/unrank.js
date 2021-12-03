module.exports = {
    data: {
        name: 'unrank',
        description: 'Remove all the sensible permissions of a member',
        options: [
            {
                type: 'USER',
                description: 'The member to remove roles',
                name: 'member',
                required: true
            }
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("UNRANK_CMD");
        await interaction.deferReply({ephemeral: true});
        if (!hasPermission)
            return interaction.editReply({
                content: lang.notEnoughPermissions('unrank')
            });
        const member = interaction.options.getMember('member')
        if (!member.manageable) return interaction.editReply({content: lang.unrank.memberNotManageable});
        const rolesToRemove = member.roles.cache.filter(role => oneforall.functions.roleHasSensiblePermissions(role.permissions) && role.editable && !role.managed && role.id !== interaction.guild.roles.everyone.id)
        rolesToRemove.forEach(role => member.roles.remove(role, `Derank by ${interaction.user.tag}`))
        await interaction.editReply({
            content: lang.unrank.success(member.toString(), rolesToRemove.size),
        })
    }
}

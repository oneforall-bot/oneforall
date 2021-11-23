module.exports = {
    data: {
        name: 'unban',
        description: 'Unban a user',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'user',
                description: 'Unban a user',
                options: [
                    {
                        required: true,
                        name: 'user',
                        description: 'The banned user',
                        type: 'USER',
                    },
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'all',
                description: 'Unban all banned members'
            }
        ],

    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("UNBAN_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions('unban')})
        const {options} = interaction
        const subCommand = options.getSubcommand()
        if(subCommand === 'user'){
            const {user} = options.get('user')
            try {
                await interaction.guild.bans.fetch(user.id)
            } catch (e) {
                return interaction.editReply({content: lang.unban.notBan(user.username)})
            }
            await interaction.guild.bans.remove(user, `Unban by ${interaction.user.username}#${interaction.user.discriminator}`).then(() => {
                interaction.editReply({content: lang.unban.success(user.username)})
            })
            const roleLogs = guildData.logs.moderation
            const channel = interaction.guild.channels.cache.get(roleLogs);
            const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
            const {template} = logs
            if(!channel) return
            channel.send({embeds : [template.guild.unban(interaction.member, user)]})
        }else{
            const banned = await interaction.guild.bans.fetch()
            if(banned.size < 1) return interaction.editReply({content: "Personne n'est banni"})
            for await(const [_, ban] of banned){
                await interaction.guild.bans.remove(ban.user.id)
            }
            interaction.editReply({content: `Unbanned **${banned.size}** members`})
        }

    }
}

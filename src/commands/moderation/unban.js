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
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("UNBAN_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions('unban')})
        const {options} = message
        const subCommand = options.getSubcommand()
        if(subCommand === 'user'){
            const {user} = options.get('user')
            try {
                await message.guild.bans.fetch(user.id)
            } catch (e) {
                return message.editReply({content: lang.unban.notBan(user.username)})
            }
            await message.guild.bans.remove(user, `Unban by ${message.author.username}#${message.author.discriminator}`).then(() => {
                message.editReply({content: lang.unban.success(user.username)})
            })
            const roleLogs = guildData.logs.moderation
            const channel = message.guild.channels.cache.get(roleLogs);
            const {logs} = oneforall.handlers.langHandler.get(guildData.lang);
            const {template} = logs
            if(!channel) return
            channel.send({embeds : [template.guild.unban(message.member, user)]})
        }else{
            const banned = await message.guild.bans.fetch()
            if(banned.size < 1) return message.editReply({content: "Personne n'est banni"})
            for await(const [_, ban] of banned){
                await message.guild.bans.remove(ban.user.id)
            }
            message.editReply({content: `Unbanned **${banned.size}** members`})
        }

    }
}

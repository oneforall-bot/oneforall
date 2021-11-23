const {Util} = require('discord.js')
module.exports = {
    data: {
        name: 'emoji',
        description: 'Add delete an emoji',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'add',
                description: 'Add an emoji',
                options: [
                    {
                        type: 'STRING',
                        required: true,
                        description: 'The emoji to add',
                        name: 'emoji'
                    },
                    {
                        type: 'STRING',
                        required: false,
                        description: 'The name of the emoji to add',
                        name: 'name'
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'delete',
                description: 'Delete an emoji',
                options: [
                    {
                        type: 'STRING',
                        required: true,
                        description: 'The emoji to delete',
                        name: 'emoji'
                    }
                ]
            }
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("ADD_EMOJI_CMD") || memberData.permissionManager.has("REMOVE_EMOJI_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions('emoji')})
        const subCommand = interaction.options.getSubcommand()
        const rawEmoji = interaction.options.get('emoji').value
        const emoji = Util.parseEmoji(rawEmoji)
        const link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
        if (subCommand === 'add') {
            const hasPermissionAdd = memberData.permissionManager.has("ADD_EMOJI_CMD")
            if (!hasPermissionAdd) return interaction.editReply({content: lang.notEnoughPermissions('emoji add')})
            const name = interaction.options.get('name')?.value
            await interaction.guild.emojis.create(link, name || emoji.id || emoji.name, {reason: `Emoji add by ${interaction.user.username}`}).then((emoji) => {
                return interaction.editReply({content: lang.emoji.add.success(emoji.toString())})
            }).catch(() => {
                return interaction.editReply({content: lang.error})
            })
        } else {
            const hasPermissionRemove = memberData.permissionManager.has("REMOVE_EMOJI_CMD")
            if (!hasPermissionRemove) return interaction.editReply({content: lang.notEnoughPermissions('emoji remove')})
            const em = await interaction.guild.emojis.resolve(emoji.id || emoji.name)
            if(!em)                return interaction.editReply({content: lang.error})

            em.delete(`Remove emoji par ${interaction.user.username}`).then((emoji) => {
                return interaction.editReply({content: lang.emoji.remove.success(emoji.name)})
            }).catch(() => {
                return interaction.editReply({content: lang.error})
            })
        }
    }
}

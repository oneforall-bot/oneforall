const {Permissions} = require("discord.js");
module.exports = {
    data: {
        name: 'lock',
        description: 'Lock channels',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'on',
                description: 'Lock the channel'
            },
            {
                type: 'SUB_COMMAND',
                name: 'off',
                description: 'Un lock the channel'
            }
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("LOCK_CMD");
        // await message.deferReply({ephemeral: (!!!hasPermission)});
        await message.deferReply({ephemeral: true})
        if (!hasPermission)
            return message.editReply({
                content: lang.notEnoughPermissions('lock')
            });
        if (!guildData.setup || !guildData.member) return message.editReply({content: lang.noSetup})
        console.log(guildData.member)
        const {options} = message;
        const subCommand = options.getSubcommand()
        if (!message.channel.manageable) return
        await message.channel.permissionOverwrites?.edit(guildData.member, {
            SEND_MESSAGES: subCommand === 'off' ? null : false
        }).then(() => {
            message.editReply({content: lang.lock.success(subCommand)})
        })

    }
}

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
    run: async (oneforall, interaction, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("LOCK_CMD");
        // await interaction.deferReply({ephemeral: (!!!hasPermission)});
        await interaction.deferReply({ephemeral: true})
        if (!hasPermission)
            return interaction.editReply({
                content: lang.notEnoughPermissions('lock')
            });
        if (!guildData.setup || !guildData.member) return interaction.editReply({content: lang.noSetup})
        console.log(guildData.member)
        const {options} = interaction;
        const subCommand = options.getSubcommand()
        if (!interaction.channel.manageable) return
        await interaction.channel.permissionOverwrites?.edit(guildData.member, {
            SEND_MESSAGES: subCommand === 'off' ? null : false
        }).then(() => {
            interaction.editReply({content: lang.lock.success(subCommand)})
        })

    }
}

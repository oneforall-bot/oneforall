module.exports = {
    data: {
        name: 'renew',
        description: 'Allows you to renew a channel'
    },
    run: async(oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("RENEW_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if(!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions('renew')})
        const position = interaction.channel.position;
        const rateLimitPerUser = interaction.channel.rateLimitPerUser;
        let newChannel = await interaction.channel.clone()
        await interaction.channel.delete();
        await newChannel.setPosition(position);
        await newChannel.setRateLimitPerUser(rateLimitPerUser)
        const tempMessage = await newChannel.send('s')
        oneforall.functions.tempMessage(tempMessage, lang.renew.success(interaction.member.toString()))
        tempMessage.delete()
    }
}

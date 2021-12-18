module.exports = {
    data: {
        name: 'renew',
        description: 'Allows you to renew a channel'
    },
    run: async(oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("RENEW_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if(!hasPermission) return message.editReply({content: lang.notEnoughPermissions('renew')})
        const position = message.channel.position;
        const rateLimitPerUser = message.channel.rateLimitPerUser;
        let newChannel = await message.channel.clone()
        await message.channel.delete();
        await newChannel.setPosition(position);
        await newChannel.setRateLimitPerUser(rateLimitPerUser)
        const tempMessage = await newChannel.send('s')
        oneforall.functions.tempMessage(tempMessage, lang.renew.success(message.member.toString()))
        tempMessage.delete()
    }
}

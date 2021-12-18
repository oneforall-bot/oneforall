module.exports = {
    data: {
        name: 'bring',
        description: 'Bring user or server to a channel',
        options: [
            {
                type: 'CHANNEL',
                description: 'The channel to bring',
                name: 'channel',
                required: true
            },
            {
                type: 'USER',
                description: 'A member to bring (none = all)',
                name: 'member'
            }
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has(`BRING_CMD`)
        await message.deferReply({ephemeral: true});
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions(`bring`)})
        const {options} = message
        const channel = options.getChannel('channel')
        const member = options.getMember('member')
        if(!channel.isVoice()) return message.editReply({content: lang.bring.notVoice})
        if(member) {
            if (!member.manageable) return message.editReply({content: lang.bring.notManageable})
            if(!member.voice.channel) return message.editReply({content: lang.bring.memberNotInChannel})
            await member.voice.setChannel(channel, `Bring by ${message.author.username}#${message.author.discriminator}`)
            return message.editReply({content: lang.bring.successMember(member.toString(), channel.toString())})
        }
        const channels = message.guild.channels.cache.filter(ch => ch.id !== channel.id && ch.isVoice() && ch.members.size > 0)
        if(channels.size < 1) return message.editReply({content: lang.bring.noOneToBring})
        for await(const [_, channelss] of channels)
            for await(const [_, member] of channelss.members) {
                await member.voice.setChannel(channel, `Bring all by ${message.author.username}#${message.author.discriminator}`).catch((e) => {
                    console.log(e)
                })
            }
        return message.editReply({content: lang.bring.success(channel.toString())})

    }
}

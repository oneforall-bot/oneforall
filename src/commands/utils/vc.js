module.exports = {
    data: {
        name: 'vc',
        description: 'Get the voice chat stats of the server'
    },
    run: async(oneforall, message, memberData, guildData) => {

        const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE');
        const members = message.guild.members.cache.filter(m => !m.bot && m.voice.channelId);
        const lang = guildData.langManager;

        let count = 0;
        let muteCount = 0;
        let streamingCount = 0;
        let muteHeadSetCount = 0;
        let openMicCount = 0;
        for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
        for (const [id, member] of members) {
            if (member.voice.mute === true && member.voice.deaf === false) {
                muteCount += 1
            }
            if (member.voice.streaming === true) {
                streamingCount += 1
            }
            if (member.voice.deaf === true) {
                muteHeadSetCount += 1
            }
            if (member.voice.mute === false && member.voice.deaf === false) {
                openMicCount += 1
            }

        }
        await message.reply({content: lang.vc.msg(count, muteCount, streamingCount, muteHeadSetCount, openMicCount)})
    }
}

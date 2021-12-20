const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "vc",
   aliases: [],
   description: "Get the voice information on the server | Afficher les informations concernant les stats vocal",
   usage: "vc",
   clientPermissions: ['SEND_MESSAGES'],
   ofaPerms: [],
   cooldown: 1000,
  /**
  * 
  * @param {OneForAll} oneforall
  * @param {Message} message 
  * @param {Collection} memberData 
  * @param {Collection} guildData 
  * @param {[]} args
  */
   run: async(oneforall, message, guildData, memberData) => {

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
    await message.channel.send({content: lang.vc.msg(count, muteCount, streamingCount, muteHeadSetCount, openMicCount)})
}
}
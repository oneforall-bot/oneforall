const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "leaderboard",
   aliases: ["lb"],
   description: "Show the leaderboard || Affiche le leaderboard",
   usage: "leaderboard [invites/xp]",
   clientPermissions: ['SEND_MESSAGES', "EMBED_LINKS"],
   cooldown: 1000,
  /**
  * 
  * @param {OneForAll} oneforall
  * @param {Message} message 
  * @param {Collection} memberData 
  * @param {Collection} guildData 
  * @param {[]} args
  */
   run: async (oneforall, message, guildData, memberData, args) => {
    const subCommand = args[0];
    if(!subCommand) return
    if(subCommand === "invites"){
        let guildInvites = oneforall.managers.membersManager.filter(memberManager => memberManager.guildId === message.guildId)
        const tempData = []
        guildInvites.forEach(memberManager => {
            tempData.push({memberId: memberManager.memberId, ...memberManager.invites})
        })
    
        const leaderboard = tempData.sort((a, b) => oneforall.functions.getTotalInvite(b) - oneforall.functions.getTotalInvite(a)).map((memberManager, i) => `\`${i + 1}\` - <@${memberManager.memberId}>: **${oneforall.functions.getTotalInvite(memberManager) || '0'}** invites (**${memberManager.join}** join, **${memberManager.leave}** leave, **${memberManager.fake}** fake, **${memberManager.bonus}** bonus)`).slice(0, 10).join('\n')
        const embed = {
            title: `Top 10 invites on ${message.guild.name}`,
            description: leaderboard,
            color: guildData.embedColor,
            timestamp: new Date()
        }
        await message.reply({embeds: [embed]})
    
    }
  
}
}
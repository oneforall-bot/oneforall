const checkSoutien = require('../../utils/check/soutien')
const checkMute = require('../../utils/check/mute')
const checkCounter = require('../../utils/check/counter')
const checkPolls = require('../../utils/check/polls')
const GiveawaysManager = require("../../utils/Giveaway/Manager");
module.exports = async (oneforall) => {
    await oneforall.functions.sleep(2000)
    console.log(`${oneforall.user.username} is ready`);
    await checkSoutien(oneforall)
    await checkMute(oneforall)
    await checkCounter(oneforall)
    await checkPolls(oneforall)
    setInterval(async () => {
        if(oneforall.shard.ids.lenght >= oneforall.shard.count)
            oneforall.user.setPresence({
                status: 'online',
                activities: [{ name: `${(await oneforall.shard.broadcastEval(client => client.guilds.cache.size)).filter(g => g.available).reduce((acc, guildCount) => acc + guildCount, 0)} Servers | !help`, type: 'WATCHING' }]
            })

    }, 60000);

    oneforall.giveawaysManager = new GiveawaysManager(oneforall, {
        updateCountdownEvery: 5000,
        hasGuildMembersIntent: true,
        default: {
            botsCanWin: false,
            exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
            embedColor: "#36393F",
            embedColorEnd: "#36393F",
            reaction: '🎉',
            lastChance: {
                enabled: true,
                content: ' **LAST CHANCE TO ENTER !**️',
                threshold: 5000,
                embedColor: '#FF0000'
            }
        }
    })

}

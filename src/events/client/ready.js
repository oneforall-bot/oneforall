const checkSoutien = require('../../utils/check/soutien')
const checkMute = require('../../utils/check/mute')
const checkCounter = require('../../utils/check/counter')
const GiveawaysManager = require("../../utils/Giveaway/Manager");
module.exports = async (oneforall) => {
    console.log(`${oneforall.user.username} is ready`);
    await checkSoutien(oneforall)
    await checkMute(oneforall)
    await checkCounter(oneforall)
    oneforall.user.setPresence({
        status: 'online',
        activities: [{name: `${oneforall.guilds.cache.size} Servers | .gg/oneforall`, type: 'WATCHING'}]
    })
    setInterval(async () => {

        oneforall.user.setPresence({
            status: 'online',
            activities: [{name: `${oneforall.guilds.cache.size} Servers | .gg/oneforall`, type: 'WATCHING'}]
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

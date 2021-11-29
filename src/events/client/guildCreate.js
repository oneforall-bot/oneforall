const { WebhookClient } = require('discord.js')
const webhook = new WebhookClient({token : "QAyDeAZ8PSHYsHbb9uUNgmv1K5H1RFQKfix-SMzS2ht1Z6HopqGKokud-OJAIPiCDYz_", id:"912776004236374026", url: "https://discord.com/api/webhooks/912776004236374026/QAyDeAZ8PSHYsHbb9uUNgmv1K5H1RFQKfix-SMzS2ht1Z6HopqGKokud-OJAIPiCDYz_"})
module.exports = async (oneforall, guild) => {

    const embed = {
        title: `Ajout ${guild.name}`,
        fields: [
            {
                name: 'Owner',
                value: `<@${guild.ownerId}> (${guild.ownerId})`
            },
            {
                name: 'membercount',
                value: guild.memberCount.toString()
            }
        ]
    }
    await webhook.send({embeds: [embed]})
}

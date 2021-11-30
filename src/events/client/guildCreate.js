const { WebhookClient } = require('discord.js')
const webhook = new WebhookClient({token : "QAyDeAZ8PSHYsHbb9uUNgmv1K5H1RFQKfix-SMzS2ht1Z6HopqGKokud-OJAIPiCDYz_", id:"912776004236374026", url: "https://discord.com/api/webhooks/912776004236374026/QAyDeAZ8PSHYsHbb9uUNgmv1K5H1RFQKfix-SMzS2ht1Z6HopqGKokud-OJAIPiCDYz_"})
let antiraidCmdLoaded = false;

module.exports = async (oneforall, guild) => {
    if (!oneforall.application?.owner) await oneforall.application?.fetch();
    const guildData = await oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    });
    if (!antiraidCmdLoaded) {
        const antiraidCmd = oneforall.handlers.slashCommandHandler.slashCommandList.get('antiraid')
        for (const options of Object.keys(guildData.antiraid.config)) {
            antiraidCmd.data.options[0].options[0].choices.push({
                name: options,
                value: options
            })
        }
        for (const options of Object.keys(guildData.antiraid.enable)) antiraidCmd.data.options[1].options[0].choices.push({
            name: options,
            value: options
        })
        for (const options of Object.keys(guildData.antiraid.limit)) {
            antiraidCmd.data.options[2].options[0].choices.push({
                name: options,
                value: options
            })
        }
        oneforall.handlers.slashCommandHandler.slashCommandList.set('antiraid', antiraidCmd)
        antiraidCmdLoaded = true
    }
    await oneforall.application?.commands.set(oneforall.handlers.contextMenuHandler.contextMenuList.concat(oneforall.handlers.slashCommandHandler.slashCommandList).sort((a, b) => a.order - b.order).map(s => s.data), guild.id)
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

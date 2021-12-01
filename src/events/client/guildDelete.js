const { WebhookClient } = require('discord.js')
const webhook = new WebhookClient({token : "gh3W7x5uIgBYFsgo9naBB4OMIDvxHIFUlppbXcePXu0BuK8-wdlnkR_i1SWr8tPDIZGB", id:"912787246493605979", url: "https://discord.com/api/webhooks/912787246493605979/gh3W7x5uIgBYFsgo9naBB4OMIDvxHIFUlppbXcePXu0BuK8-wdlnkR_i1SWr8tPDIZGB"})
module.exports = async (oneforall, guild) => {
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    guildData.delete()
    oneforall.managers.rolesManager.filter(g => g.guildId === guild.id).forEach(g_ => g_.delete())
    oneforall.managers.membersManager.filter(g => g.guildId === guild.id).forEach(g => g.delete())
    oneforall.managers.groupsManager.filter(g => g.guildId === guild.id).forEach(g => g.delete())
    oneforall.managers.groupsManager.filter(g => g.guildId === guild.id).forEach(g => g.delete())
    oneforall.slashReloaded.delete(guild.id)
    const embed = {
        title: `Oneforall retirer de ${guild.name}`,
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

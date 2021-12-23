const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "roleinfo",
    aliases: ["inforole", 'ir'],
    description: "Get the information about a role | Avoir les informations sur un role",
    usage: "roleinfo <role>",
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    ofaPerms: ['INFO_CMD'],
    cooldown: 1500,
    /**
    * 
    * @param {OneForAll} oneforall
    * @param {Message} message 
    * @param {Collection} memberData 
    * @param {Collection} guildData 
    * @param {[]} args
    */
    run: async (oneforall, message, guildData, memberData, args) => {
        const lang = guildData.langManager
        const embeds = [{ ...oneforall.embed(guildData.embedColor), fields: [], description: '' }]
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role) {
            const roles = message.guild.roles.cache
            embeds[0].description = lang.info.guild.roles(roles.size)
            return message.channel.send({ embeds })
        }
        embeds[0].description = `**Information about ${role.toString()}:**`
        embeds[0].fields = [
            {
                name: 'Name:',
                value: role.name,
                inline: true,
            },
            {
                name: 'Id:',
                value: role.id,
                inline: true,

            },
            {
                name: 'Color:',
                value: role.hexColor.toString(),
                inline: true,

            },
            {
                name: 'Hoist:',
                value: role.hoist ? '<:authorized:917131189779845131>' : '<:xmark:917130858543075369>',
                inline: true,

            },
            {
                name: 'Managed:',
                value: role.managed ? '<:authorized:917131189779845131>' : '<:xmark:917130858543075369>',
                inline: true,

            },
            {
                name: 'Mentionable:',
                value: role.mentionable ? '<:authorized:917131189779845131>' : '<:xmark:917130858543075369>',
                inline: true,

            },
            {
                name: 'Members:',
                value: role.members.size.toString(),
                inline: true,
            },
            {
                name: 'Permissions:',
                value: role.permissions.toArray().map(perm => `\`${perm}\``).join(', ') || 'No permissions',
                inline: false
            }
        ]
        if (role.tags) embeds[0].fields.push({
            name: 'Tags:',
            inline: true,
            value: (role.tags?.botId ? `Bot id : ${role.tags?.botId}\n` : ' ') + (role.tags?.integrationId ? `Integration id : ${role.tags?.integrationId}\n` : ' ') + (role.tags?.premiumSubscriberRole ? `Premium subscriber role : ${role.tags?.premiumSubscriberRole}\n` : '')
        })
        message.channel.send({embeds})
    }
}
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "serverinfo",
    aliases: ['si', 'infoserver'],
    description: "Show iformation about the server | Avoir des informations sur le serveur",
    usage: "serverinfo",
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    ofaPerms: ['INFO_CMD'],
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
        const embeds = [{...oneforall.embed(guildData.embedColor), fields: []}]
        const verificationLevels = {
            NONE: 'NONE',
            LOW: 'LOW',
            MEDIUM: 'MEDIUM',
            HIGH: 'HIGH',
            VERY_HIGH: 'VERY HIGH'
        };
        const guildOwner = await message.guild.fetchOwner()
        const guildMembers = await message.guild.members.fetch()
        embeds[0].fields.push(
            {
                name: 'Owner:',
                value: guildOwner.toString(),
                inline: true
            },
            {
                name: 'Channels:',
                value: `Text: \`${message.guild.channels.cache.filter(channel => channel.isText()).size}\`\n Voice: \`${message.guild.channels.cache.filter(channel => channel.isVoice()).size}\``,
                inline: true
            },
            {
                name: 'Verification Level:',
                value: `**${verificationLevels[message.guild.verificationLevel]}**`,
                inline: true
            },
            {
                name: 'Boosts:',
                value: `\`${message.guild.premiumSubscriptionCount.toString()}\``,
                inline: true
            },
            {
                name: 'Afk channel:',
                value: message.guild.afkChannel?.toString() || 'None',
                inline: true
            },
            {
                name: 'Created:',
                value: `<t:${oneforall.functions.dateToEpoch(message.guild.createdAt)}:R>`,
                inline: true,
            },
            {
                name: 'Members:',
                inline: true,
                value: `Online: **${guildMembers.filter(member => member.presence?.status === 'online').size}**\n Dnd: **${guildMembers.filter(member => member.presence?.status === 'dnd').size}**\nIdle: **${guildMembers.filter(member => member.presence?.status === 'idle').size}**\nOffline: **${guildMembers.filter(member => member.presence?.status !== 'online' && member.presence?.status !== 'idle' && member.presence?.status !== 'dnd').size}**\nTotal: **${message.guild.memberCount}**`
            },
            {
                name: `Roles (${message.guild.roles.cache.size}):`,
                value: message.guild.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map(r => r)
                    .slice(0, 10)
                    .join(","),
                inline: true
            },
            {
                name: `Emojis (${message.guild.emojis.cache.size}):`,
                value: `Normal Emojis: **${message.guild.emojis.cache.filter(emoji => !emoji.animated).size}**\nAnimated Emojis: **${message.guild.emojis.cache.filter(emoji => emoji.animated).size}**`,
                inline: true
            }
        )
        embeds[0].thumbnail = { url: message.guild.iconURL({ dynamic: true }) }
        if (message.guild.bannerURL()) {
            embeds[0].image = { url: message.guild.bannerURL({ dynamic: true }) }

        }
        message.channel.send({embeds})
    }
}
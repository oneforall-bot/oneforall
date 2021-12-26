const { MessageActionRow, MessageButton } = require("discord.js");
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "blacklist",
    aliases: ["bl"],
    description: "Add, remove member from the blacklists | Ajouter, enlever des utilisateurs de la blacklist",
    usage: "blacklist <add/remove/list> <member> <reason>",
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    ofaPerms: ["BLACKLIST_CMD"],

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
        const subCommand = args[0]
        if (subCommand === 'add') {

            const targetUser = !isNaN(args[1]) ? (await oneforall.users.fetch(args[1]).catch(() => { })) : undefined || message.mentions.users.first()
            const alreadyBlacklisted = oneforall.managers.blacklistManager.find(v => v.guildId === message.guildId && targetUser.id === v.userId);
            const reason = args.slice(2).join(" ") || `Blacklisted by ${message.author.username}#${message.author.discriminator}`
            if (alreadyBlacklisted)
                return message.channel.send({
                    embeds: [
                        {
                            color: guildData.embedColor,
                            description: `<@${targetUser.id}> already blacklisted by <@${alreadyBlacklisted.authorId}> \n\n Reason: \`${alreadyBlacklisted.reason}\``
                        }
                    ],
                });

            oneforall.managers.blacklistManager.getAndCreateIfNotExists(`${message.guildId}-${targetUser.id}`, {
                guildId: message.guildId,
                userId: targetUser.id,
                authorId: message.author.id,
                reason
            }).save().then(() => {
                message.guild.members.ban(targetUser, {
                    reason
                })
            });

            message.channel.send({
                embeds: [
                    {
                        color: guildData.embedColor,
                        description: `<@${targetUser.id}> successfully blacklisted by <@${message.author.id}> for \`${reason}\``
                    }
                ]
            }).catch(() => {
            })
        }
        if (subCommand === 'remove') {

            const targetUser = !isNaN(args[1]) ? (await oneforall.users.fetch(args[1]).catch(() => { })) : undefined || message.mentions.users.first()



            const alreadyBlacklisted = oneforall.managers.blacklistManager.find(v => v.guildId === message.guildId && targetUser.id === v.userId);

            if (!alreadyBlacklisted)
                return message.channel.send({
                    embeds: [
                        {
                            color: guildData.embedColor,
                            description: `<@${targetUser.id}> is not blacklisted`
                        }
                    ],
                });

            oneforall.managers.blacklistManager.getAndCreateIfNotExists(`${message.guildId}-${targetUser.id}`).delete()
            message.guild.members.unban(targetUser, `UnBlacklisted by ${message.author.tag}`)

            message.channel.send({
                embeds: [
                    {
                        color: guildData.embedColor,
                        description: `<@${targetUser.id}> successfully unblacklisted by <@${message.author.id}>`
                    }
                ]
            }).catch(() => {
            })
        }
        if (subCommand === 'list') {
            const blacklist = oneforall.managers.blacklistManager.filter(bl => bl.guildId === message.guildId)
            const embedChange = (page, slicerIndicatorMin, slicerIndicatorMax, totalPage) => {
                let i = 0
                return {
                    ...oneforall.embed(guildData),
                    title: `All blacklisted (${blacklist.size})`,
                    footer: {
                        text: `Page ${page + 1}/${totalPage || 1}`
                    },
                    description: blacklist.map((bl) => {
                        i++
                        return `\`${i}\` ・ <@${bl.userId}> \`(${bl.userId})\`\nAuthor: <@${bl.authorId}>\`(${bl.authorId})\``;

                    }).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

                }
            }
            await new oneforall.DataMenu(blacklist, embedChange, message, oneforall).sendEmbed()
        }

    }
}

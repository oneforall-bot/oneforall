const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "userinfo",
    aliases: ['ui', 'infouser'],
    description: "Get information about a user | Avoir les information sur un utilisateur",
    usage: "userinfo [member]",
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
        const user  = await oneforall.users.fetch(args[0]).catch(() => {})  || message.mentions.users.first() || message.author
        const member = (await message.guild.members.fetch(user.id).catch(() => {})) 
        const embeds = [{...oneforall.embed(guildData.embedColor), fields: []}]
        const statusFilter = {
            online: ':green_circle:',
            idle: ':orange_circle:',
            dnd: ':red_circle:',
            offline: ':black_circle:'
        }
        const flags = {
            DISCORD_EMPLOYEE: 'Discord Employee',
            DISCORD_PARTNER: 'Discord Partner',
            BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
            BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
            HYPESQUAD_EVENTS: 'HypeSquad Events',
            HOUSE_BRAVERY: 'House of Bravery',
            HOUSE_BRILLIANCE: 'House of Brilliance',
            HOUSE_BALANCE: 'House of Balance',
            EARLY_SUPPORTER: 'Early Supporter',
            TEAM_USER: 'Team User',
            SYSTEM: 'System',
            VERIFIED_BOT: 'Verified Bot',
            VERIFIED_DEVELOPER: 'Verified Bot Developer'
        };
        embeds[0].description = `Information about ${user.toString()}`
        embeds[0].fields.push(
            {
                name: 'Name:',
                value: user.username,
                inline: true
            },
            {
                name: 'Discriminator:',
                value: user.discriminator,
                inline: true
            },
            {
                name: 'Id:',
                value: user.id,
                inline: true
            },
            {
                name: 'Bot:',
                value: user.bot ? '<:authorized:917131189779845131>' : '<:xmark:917130858543075369>',
                inline: true
            },

            {
                name: 'Flags:',
                value: (await user.fetchFlags()).toArray().length ? user.flags.toArray().map(flag => flags[flag]).join(', ') : 'None',
                inline: true
            },
            {
                name: 'Account created at:',
                value: `<t:${oneforall.functions.dateToEpoch(user.createdAt)}:R>`,
                inline: true
            },
        )
        if (member) {
            const targetData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${member.id}`, {
                guildId: message.guild.id,
                memberId: member.id
            });
            targetData.permissionManager = new oneforall.Permission(oneforall, message.guild.id, member.id, targetData, guildData);
            embeds[0].fields.push(
                {
                    name: `Joined ${message.guild.name}:`,
                    inline: true,
                    value: `<t:${oneforall.functions.dateToEpoch(member.joinedAt)}:R> `
                },
                {
                    name: 'Nickname:',
                    inline: true,
                    value: member.nickname || "N/A"
                },
                {
                    name: 'Highest role:',
                    inline: true,
                    value: member.roles.hoist?.toString() || 'None'
                },
                {
                    name: 'Status:',
                    value: statusFilter[member.presence?.status || 'offline'],
                    inline: true
                },
                {
                    name: 'oneforall Permissions:',
                    value: targetData.permissionManager.list().map((permission => `${permission} \`(${targetData.permissionManager.enumPermissions.permissions[permission]?.description})\``)).join(',\n') || "None",
                    inline: false
                },
                {
                    name: 'oneforall Groups:',
                    value: targetData.permissionManager.getGroupsPermissionManager().map(({ groupData }) => groupData.groupName).join(', ') || 'None',
                    inline: true
                }
            )
            embeds[0].thumbnail = { url: user.displayAvatarURL({ dynamic: true }) }

        }
        message.channel.send({embeds})
    }
}
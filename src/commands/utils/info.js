const {MessageButton, MessageActionRows, MessageActionRow} = require('discord.js'),
    moment = require('moment')
const {version} = require('../../../package.json'),
    {version: djsversion} = require('discord.js')
const ms = require("ms");
const os = require("os");



module.exports = {
    data: {
        name: 'info',
        description: 'Get information about a user, the guild or a role',
        options: [
            {
              name: 'bot',
              type: 'SUB_COMMAND',
              description: 'Get information about the bot',
            },
            {
                name: 'user',
                type: 'SUB_COMMAND_GROUP',
                description: 'Get information about a user',
                options: [
                    {
                        type: 1,
                        name: 'ban',
                        description: 'Get the ban information of the user',
                        options: [
                            {
                                type: 'USER',
                                name: 'user',
                                description: 'The user to get information about',
                                required: true
                            }
                        ]
                    },
                    {
                        type: 1,
                        name: 'general',
                        description: 'Get the general information about the user',
                        options: [
                            {
                                type: 'USER',
                                name: 'user',
                                description: 'The user to get information about',
                                required: true
                            }
                        ]
                    }
                ],

            },
            {
                name: 'role',
                type: 'SUB_COMMAND',
                description: 'Get information about a role',
                options: [
                    {
                        type: 'ROLE',
                        required: true,
                        description: 'The role to get information about',
                        name: 'role'
                    }
                ],

            },
            {
                name: 'guild',
                type: "SUB_COMMAND_GROUP",
                description: "Get information about the guild",
                options: [
                    {
                        type: 'SUB_COMMAND',
                        name: 'bans',
                        description: 'Get bans informations of the guild',
                        options: [
                            {
                                type: 'BOOLEAN',
                                name: 'list',
                                description: 'Show all the bans',
                                required: false
                            }
                        ]
                    },
                    {
                        type: 'SUB_COMMAND',
                        name: 'roles',
                        description: 'Get information about the roles on the guild'
                    },
                    {
                        type: 1,
                        name: 'general',
                        description: 'Get the general information about the guild',
                    }
                ]
            }
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("INFO_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions('info')})
        const subCommandGroup = message.options.getSubcommandGroup(false)
        const subCommand = message.options.getSubcommand()
        const embeds = [{
            color: guildData.embedColor,
            fields: []
        }]
        if(subCommand === 'bot'){
            const takefy = await oneforall.users.fetch("708047733994553344")
            embeds[0].title = 'Bot info'
            embeds[0].fields = [
                {
                    name: 'INFORMATION',
                    value: `Date de création: <t:${oneforall.functions.dateToEpoch(oneforall.user.createdAt)}:R>\nDevelopers: **${takefy.tag}**\nNode.js: **${process.version}**\nVersion: **v${version}**\nDiscord.js: **${djsversion}**\nBot Uptime: **${ms(oneforall.uptime)}**\u200b`
                },
                {
                    name: 'STATISTICS',
                    value: `Serveurs: **${oneforall.guilds.cache.size.toLocaleString()}**\nUsers: **${oneforall.guilds.cache.filter(guild => guild.available).reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString()}**\nChannels: **${oneforall.channels.cache.size.toLocaleString()}**\u200b`
                },
                {
                    name: 'SYSTEM',
                    value: `Plateforme: **${process.platform}**\nUptime: **${ms(os.uptime() * 1000, {long: true})}**\nCPU:\n \u3000Coeurs: **${os.cpus().length}**\n`
                }
            ]
        }
        if (subCommandGroup === 'user') {
            const {user, member} = message.options.get('user')
            if (subCommand === 'ban') {
                const ban = await message.guild.bans.fetch(user).catch(() => {
                })
                embeds[0].title = `Ban information about ${user.username}`
                embeds[0].fields = [
                    {
                        name: 'Banned:',
                        value: !ban ? '❌' : '✅',
                    },
                ]
                if (ban) {
                    embeds[0].fields.push({
                        name: 'Reason',
                        value: ban.reason || 'N/A'
                    })
                }

            }
            if (subCommand === 'general') {
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
                        value: user.flags.toArray().length ? user.flags.toArray().map(flag => flags[flag]).join(', ') : 'None',
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
                        guildId: message.member.guild.id,
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
                            value: targetData.permissionManager.getGroupsPermissionManager().map(({groupData}) => groupData.groupName).join(', ') || 'None',
                            inline: true
                        }
                    )
                    embeds[0].thumbnail = {url: user.displayAvatarURL({dynamic: true})}
                }
            }
        }
        if (subCommandGroup === 'guild') {
            if (subCommand === 'bans') {
                const list = message.options.get('list')?.value
                const bans = await message.guild.bans.fetch()
                embeds[0].description = lang.info.guild.bans(bans.size)
                if (list) {
                    let row
                    embeds[1] = {
                        timestamp: new Date(),
                        color: guildData.embedColor,
                        footer: {
                            text: `Page 1/1`,
                            icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                        },
                    }
                    let maxPerPage = 10
                    if (bans.size > maxPerPage) {
                        let page = 0
                        let slicerIndicatorMin = 0,
                            slicerIndicatorMax = 10

                        let totalPage = Math.ceil(bans.size / maxPerPage)
                        const embedPageChanger = (page) => {
                            embeds[1].description = bans.map((ban, id) => `<@${id}> ・ ${ban.reason || 'N/A'}`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                            embeds[1].footer.text = `Page ${page + 1} / ${totalPage}`
                            return embeds[1]
                        }
                        embeds[1] = embedPageChanger(page)
                        row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`bans.list.left.${message.id}`)
                                    .setEmoji('◀️')
                                    .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`bans.list.cancel.${message.id}`)
                                    .setEmoji('❌')
                                    .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`bans.list.right.${message.id}`)
                                    .setEmoji('➡️')
                                    .setStyle('SECONDARY')
                            )
                        const componentFilter = {
                            filter: messageList => messageList.customId.includes(`bans.list`) && messageList.customId.includes(message.id) && messageList.user.id === message.author.id,
                            time: 900000
                        }
                        const collector = message.channel.createMessageComponentCollector(componentFilter)
                        collector.on('collect', async (messageList) => {
                            await messageList.deferUpdate()
                            const selectedButton = messageList.customId.split('.')[2]
                            if (selectedButton === 'left') {
                                page = page === 0 ? page = totalPage - 1 : page <= totalPage - 1 ? page -= 1 : page += 1
                                slicerIndicatorMin -= maxPerPage
                                slicerIndicatorMax -= maxPerPage


                            }
                            if (selectedButton === 'right') {
                                page = page !== totalPage - 1 ? page += 1 : page = 0
                                slicerIndicatorMin += maxPerPage
                                slicerIndicatorMax += maxPerPage

                            }
                            if (selectedButton === 'cancel') {
                                return collector.stop()
                            }
                            if (slicerIndicatorMax < 0 || slicerIndicatorMin < 0) {
                                slicerIndicatorMin += maxPerPage * totalPage
                                slicerIndicatorMax += maxPerPage * totalPage
                            } else if ((slicerIndicatorMax >= maxPerPage * totalPage || slicerIndicatorMin >= maxPerPage * totalPage) && page === 0) {
                                slicerIndicatorMin = 0
                                slicerIndicatorMax = maxPerPage
                            }

                            await message.editReply({
                                embeds: [embeds[0], embedPageChanger(page)]
                            })


                        })
                        collector.on('end', () => {
                            message.editReply({
                                embeds: [embeds[0]],
                                components: []
                            })
                        })


                    } else {
                        embeds[1].description = bans.map((ban, id) => ` <@${id}>・ ${ban.reason || 'N/A'}`).join('\n')
                    }
                    return message.editReply({embeds, components: [row]})

                }
            }

            if (subCommand === 'roles') {
                const roles = message.guild.roles.cache
                embeds[0].description = lang.info.guild.roles(roles.size)
            }
            if (subCommand === "general") {
                const verificationLevels = {
                    NONE: 'NONE',
                    LOW: 'LOW',
                    MEDIUM: 'MEDIUM',
                    HIGH: 'HIGH',
                    VERY_HIGH: 'VERY HIGH'
                };
                const guildOwner = await message.guild.fetchOwner()
                const guildMembers = await message.guild.members.fetch({withPresences: true})
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
                embeds[0].thumbnail = {url: message.guild.iconURL({dynamic: true})}
                if (message.guild.bannerURL()) {
                    embeds[0].image = {url: message.guild.bannerURL({dynamic: true})}

                }

            }
        }
        if (subCommand === 'role') {
            const {role} = message.options.get('role')
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
        }
        await message.editReply({embeds})

    }
}

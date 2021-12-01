const {MessageSelectMenu, MessageActionRow} = require("discord.js");
module.exports = {
    data: {
        name: 'permissions',
        description: 'Manage the oneforall permissions of a user',
    },
    guildOwnersOnly: true,
    run: async (oneforall, interaction, memberData, guildData) => {
        interaction.reply({
            embeds: [
                {
                    title: `Liste des groupes`,
                    description: [...oneforall.managers.groupsManager.keys()].filter(g => g.startsWith(interaction.guild.id)).map(g => `\`${g.split("-")[1]}\``).join("\n\n")
                }
            ]
        })
        createOrEditGroup(oneforall, interaction, guildData, memberData);
        function changePermissions(message, defaultMessage, guildData, memberToEditData) {
            return new Promise((resolve) => {
                const enumPermissions = memberToEditData.permissionManager.enumPermissions;
                const allowPermissions = Object.keys(enumPermissions.permissions).filter(k => memberToEditData.permissionManager.list().includes(k));
                const denyPermissions = Object.keys(enumPermissions.permissions).filter(k => !memberToEditData.permissionManager.list().includes(k));
                const groupsIn = message.client.managers.groupsManager.filter(g => g.key.startsWith(message.guild.id)).filter(group => memberToEditData.groups.includes(group.groupName))
                const groupsNotIn = message.client.managers.groupsManager.filter(g => g.key.startsWith(message.guild.id)).filter(group => !memberToEditData.groups.includes(group.groupName))
                const components = [];
                const defaultDenyOptions = denyPermissions.map(v => {
                    const p = enumPermissions.permissions[v];
                    return {
                        emoji: p.emoji,
                        label: p.label,
                        description: p.description,
                        value: v
                    }
                })
                const defaultAllowOptions = allowPermissions.map(v => {
                    const p = enumPermissions.permissions[v];
                    return {
                        emoji: p.emoji,
                        label: p.label,
                        description: p.description,
                        value: v
                    }
                })
                const defaultGroupsInOptions = groupsIn.map(g => {
                    return {
                        emoji: '',
                        label: g.groupName,
                        description: `The ${g.groupName} group`,
                        value: g.groupName
                    }
                })
                const defaultGroupsNotInOptions = groupsNotIn.map(g => {
                    return {
                        emoji: '',
                        label: g.groupName,
                        description: `The ${g.groupName} group`,
                        value: g.groupName
                    }
                })

                if (denyPermissions.length > 0)
                    components.push(new MessageSelectMenu({
                        customId: `permissions.edit.add.${message.id}`,
                        placeholder: `Ajouter des permissions.`,
                        maxValues: denyPermissions.length <= 25 ? denyPermissions.length : 25,
                        options: defaultDenyOptions
                    }))
                if (allowPermissions.length > 0)
                    components.push(new MessageSelectMenu({
                        customId: `permissions.edit.remove.${message.id}`,
                        placeholder: `Retirer des permissions.`,
                        maxValues: allowPermissions.length <= 25 ? allowPermissions.length : 25,
                        options: defaultAllowOptions
                    }))
                if (groupsIn.size > 0) {
                    components.push(new MessageSelectMenu({
                        customId: `permissions.edit.group.remove.${message.id}`,
                        placeholder: `Retirer des groupes.`,
                        maxValues: groupsIn.size <= 25 ? groupsIn.size : 25,
                        options: defaultGroupsInOptions
                    }))
                }

                if (groupsNotIn.size > 0) {
                    components.push(new MessageSelectMenu({
                        customId: `permissions.edit.group.add.${message.id}`,
                        placeholder: `Ajouter des groupes.`,
                        maxValues: groupsNotIn.size <= 25 ? groupsNotIn.size : 25,
                        options: defaultGroupsNotInOptions
                    }))
                }

                let pageDeny = 0;
                let pageAllow = 0;
                const maxValues = 24;
                let totalPageDeny = Math.ceil(denyPermissions.length / maxValues)
                let slicerIndicatorMinDeny = 0
                let slicerIndicatorMaxDeny = 24
                let totalPageAllow = Math.ceil(allowPermissions.length / maxValues)
                let slicerIndicatorMinAllow = 0
                let slicerIndicatorMaxAllow = 24
                if (denyPermissions.length > 25) {
                    components[0].spliceOptions(0, denyPermissions.length, [...defaultDenyOptions.slice(0, 24), {
                        value: 'next',
                        description: 'See more permissions',
                        label: 'Next',
                        emoji: '➡️'
                    }])
                }
                let index = components[1] ? 1 : 0

                if (allowPermissions.length > 25) {
                    components[index].spliceOptions(0, allowPermissions.length, [...defaultAllowOptions.slice(0, 24), {
                        value: 'next',
                        description: 'See more permissions',
                        label: 'Next',
                        emoji: '➡️'
                    }])
                }

                function updateOptions(interaction, componentIndex) {
                    components[componentIndex].spliceOptions(0, components[componentIndex].options.length, componentIndex === 0 ? [...defaultDenyOptions.slice(slicerIndicatorMinDeny, slicerIndicatorMaxDeny), {
                        value: pageDeny < 1 ? 'next' : "prev",
                        description: 'See more permissions',
                        label: pageDeny < 1 ? 'next' : "prev",
                        emoji: pageDeny < 1 ? '➡️' : '◀️'
                    }] : [...defaultAllowOptions.slice(slicerIndicatorMinAllow, slicerIndicatorMaxAllow), {
                        value: pageAllow < 1 ? 'next' : "prev",
                        description: 'See more permissions',
                        label: pageAllow < 1 ? 'next' : "prev",
                        emoji: pageAllow < 1 ? '➡️' : '◀️'
                    }])
                    components[componentIndex].setMaxValues(components[componentIndex].options.length)
                    return interaction.update({components: components.map(c => new MessageActionRow({components: [c]}))})
                }

                defaultMessage.edit({
                    embeds: [
                        {
                            description: `D'accord, voici le membre ou le role que vous modifié: <@${memberToEditData.roleId ? '&' : ""}${memberToEditData.memberId || memberToEditData.roleId}> \n\n Maintenant, je vous demande de choisir les permissions ou les groupes. \n\nGroupes actuel: \n\n ${groupsIn.size > 0 ? groupsIn.map(g => `\`${g.groupName}\``) : `\`Aucun groupe\``}  \n\n Permissions actuellement acordé:  \n\n ${allowPermissions.length > 0 ? allowPermissions.map(v => `\`${v}\` (*${enumPermissions.permissions[v].description}*)`).join('\n') : `\`Aucune permissions\``}`,
                        }
                    ],
                    components: components.map(c => new MessageActionRow({components: [c]}))
                });
                const collector = message.channel.createMessageComponentCollector({
                    filter: interaction => [`permissions.edit.add.${message.id}`, `permissions.edit.remove.${message.id}`, `permissions.edit.group.add.${message.id}`, `permissions.edit.group.remove.${message.id}`].includes(interaction.customId) && interaction.user.id === message.user.id,
                    time: 60 * 1000
                })
                collector.on('collect', async interaction => {

                    if (interaction.values[0] === 'next') {
                        interaction.customId === `permissions.edit.remove.${message.id}` ? pageAllow = pageAllow !== totalPageAllow - 1 ? pageAllow + 1 : pageAllow = 0 : pageDeny = pageDeny !== totalPageDeny - 1 ? pageDeny + 1 : pageDeny = 0
                        interaction.customId === `permissions.edit.remove.${message.id}` ? slicerIndicatorMinAllow += maxValues : slicerIndicatorMinDeny += maxValues
                        interaction.customId === `permissions.edit.remove.${message.id}` ? slicerIndicatorMaxAllow += maxValues : slicerIndicatorMaxDeny += maxValues

                        return updateOptions(interaction, interaction.customId === `permissions.edit.remove.${message.id}` ? index : 0)
                    }

                    if (interaction.values[0] === 'prev') {
                        interaction.customId === `permissions.edit.remove.${message.id}` ? pageAllow = pageAllow === 0 ? pageAllow = totalPageAllow - 1 : pageAllow <= totalPageAllow - 1 ? pageDeny -= 1 : pageDeny += 1 : pageDeny = pageDeny === 0 ? pageDeny = totalPageDeny - 1 : pageDeny <= totalPageDeny - 1 ? pageDeny -= 1 : pageDeny += 1
                        interaction.customId === `permissions.edit.remove.${message.id}` ? slicerIndicatorMinAllow -= maxValues : slicerIndicatorMinDeny -= maxValues
                        interaction.customId === `permissions.edit.remove.${message.id}` ? slicerIndicatorMaxAllow -= maxValues : slicerIndicatorMaxDeny -= maxValues
                        return updateOptions(interaction, interaction.customId === `permissions.edit.remove.${message.id}` ? index : 0)

                    }
                    switch (interaction.customId) {
                        case `permissions.edit.remove.${message.id}`:
                            memberToEditData.permissions = memberToEditData.permissions.filter(permission => !interaction.values.includes(permission));
                            break;
                        case `permissions.edit.group.add.${message.id}`:
                            memberToEditData.groups.push(...interaction.values)
                            break;
                        case `permissions.edit.group.remove.${message.id}`:
                            memberToEditData.groups = memberToEditData.groups.filter(group => !interaction.values.includes(group));
                            break;
                        default:
                            memberToEditData.permissions.push(...interaction.values.filter(p => !memberToEditData.permissions.includes(p)));
                    }
                    await interaction.deferUpdate()
                    changePermissions(message, defaultMessage, guildData, memberToEditData).then(() => resolve(memberToEditData.groups)).catch(() => {
                    });
                    collector.stop()
                })
                defaultMessage.awaitReactions({
                    filter: (reaction, user) => reaction.emoji.name === "✅" && user.id === message.user.id,
                    time: 60 * 1000,
                    max: 1
                })
                    .then(() => {

                        resolve(memberToEditData.groups)
                    })
            })
        }


        async function createOrEditGroup(oneforall, message, guildData, memberData, args) {
            const defaultMessage = await message.channel.send({
                embeds: [
                    {
                        description: "Pouvez mentionner le membre ou le role à modifier les permissions ?"
                    }
                ]
            });
            message.channel.awaitMessages({
                filter: m => m.author.id === message.user.id,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async collected => {
                const messageGroupId = collected.first();
                const memberToEdit = messageGroupId.mentions.members.first() || messageGroupId.mentions.roles.first() || message.guild.roles.cache.get(messageGroupId.content) || (await message.guild.members.fetch(messageGroupId.content).catch(() => {
                }));
                const isRole = memberToEdit.toString().includes('&')
                const memberToEditData = isRole ? oneforall.managers.rolesManager.getAndCreateIfNotExists(`${message.guild.id}-${memberToEdit.id}`, {
                    roleId: memberToEdit.id,
                    guildId: message.guild.id
                }) : oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${memberToEdit.id}`, {
                    guildId: message.guild.id,
                    memberId: memberToEdit.id
                });
                memberToEditData.permissionManager = new oneforall.Permission(oneforall, message.guild.id, memberToEdit.id, memberToEditData, guildData, isRole ? memberData : undefined);
                messageGroupId.delete();
                defaultMessage.react("✅");
                changePermissions(message, defaultMessage, guildData, memberToEditData).then((groups) => {
                    defaultMessage.reactions.removeAll();
                    defaultMessage.edit({
                        embeds: [
                            {
                                description: `Le membre ou le role ${memberToEdit.toString()} viens d'etre modifié avec succès. \n\n  Voici les groupes et les permissions du membre: Groupes:\n\n Groupes actuel: \n\n ${memberToEditData.groups.length > 0 ? memberToEditData.groups.map(g => `\`${g}\``) : `\`Aucun groupe\``}  Permissions: \n\n ${memberToEditData.permissionManager.list().length > 0 ? memberToEditData.permissionManager.list().map(k => `\`${k}\` (*${memberToEditData.permissionManager.enumPermissions.permissions[k].description}*)`).join("\n") : `\`Aucune permissions\``}`
                            }
                        ],
                        components: []
                    }).catch(e => console.log(e))
                    memberToEditData.save()
                }).catch((e) => {
                    console.log(e)
                })
            }).catch((e) => {
                console.log(e)
            });
        }
    }
}



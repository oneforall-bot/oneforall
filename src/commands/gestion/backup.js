const backup = require('../../utils/Backup/lib')
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "backup",
    aliases: [],
    description: "Create, load, delete or list backups | Créer, load, suppprimer ou lister les backups",
    usage: "backup <create/delete/load/info/list> [roles/backupId] [emojis] [channels] [bans]",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: ["BACKUP_CMD"],
    guildOwnersOnly: false,
    guildCrownOnly: false,
    ownersOnly: false,
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
        const lang = guildData.langManager
    
        let userBackups = (await oneforall.shard.broadcastEval((client, { authorId }) => {
            return client.managers.backupsManager.getAndCreateIfNotExists(authorId, {
                userId: authorId
            }).backups
        }, { context: { authorId: message.author.id } })).reduce((acc, backup, i, array) => {
            return [...backup]
        }, [])
        userBackups = userBackups.filter((backup, i) => userBackups.indexOf(backup) == i)
        if (subCommand === 'create') {
            let backupRoles = args.includes('roles')
            let backupEmojis = args.includes('emojis')
            let backupChannels = args.includes('channels')
            let backupBans = args.includes('bans')
            const doNotBackup = [!backupRoles ? "roles" : null, !backupEmojis ? "emojis" : null, !backupChannels ? "channels" : null, !backupBans ? "bans" : null]
            const loading = await message.channel.send('Loading ...')
            backup.create(message.guild, {
                maxMessagesPerChannel: 0,
                jsonSave: false,
                jsonBeautify: true,
                doNotBackup
            }).then(backupData => {
                userBackups.push(backupData)
                oneforall.shard.broadcastEval((client, { authorId, backupData }) => {
                    client.managers.backupsManager.getAndCreateIfNotExists(authorId, {
                        userId: authorId
                    }).backups.push(backupData)
                }, { context: { authorId: message.author.id, backupData } }).then(() =>{ 
                    oneforall.managers.backupsManager.getAndCreateIfNotExists(message.author.id, {
                        userId: message.author.id
                    }).save()
                    loading.edit({ content: lang.backup.create.success(backupData.id) })})
                
            })
        }
        if (subCommand === 'load') {
            const backupId = args[1]
            const backupData = userBackups.find(backup => backup.id === backupId)
            if (!backupData) return oneforall.functions.tempMessage(message, lang.backup.backupNotFound)
            await backup.load(backupData, message.guild, {
                clearGuildBeforeRestore: true
            }).catch(() => { }).then(() => oneforall.functions.tempMessage(message, 'Backup loaded'))
        }
        if (subCommand === 'delete') {
            const backupId = args[1]
            const backupData = userBackups.backups.find(backup => backup.id === backupId)
            if (!backupData) return oneforall.functions.tempMessage(message, lang.backup.backupNotFound)
            userBackups = userBackups.filter(backup => backup.id !== backupData.id)
            oneforall.shard.broadcastEval((client, { authorId, userBackups }) => {
                client.managers.backupsManager.getAndCreateIfNotExists(authorId, {
                    userId: authorId
                }).backups = userBackups
                

            }, { context: { authorId: message.author.id, userBackups } }).then(() => { 
                oneforall.functions.tempMessage(message, lang.backup.delete.success(backupId)) 
                oneforall.managers.backupsManager.getAndCreateIfNotExists(message.author.id, {
                    userId: message.author.id
                }).save()
            })
           
        }
        if (subCommand === 'list') {
            if (!userBackups.length) return oneforall.functions.tempMessage(message, 'No backups')
            const backupsName = [];
            const backupsId = [];
            for (const backup of userBackups) {
                backupsName.push(backup.name + '  **:**');
                backupsId.push(backup.id);
            }
            const embed = {
                title: `List des backups de __${message.author.username}__`,
                fields: [
                    {
                        name: 'Server Name',
                        value: backupsName.join('\n'),
                        inline: true
                    },
                    {
                        name: '🏷 Backup Id',
                        value: backupsId.join('\n'),
                        inline: true
                    }
                ],
                timestamp: new Date(),
                color: guildData.embedColor,
                footer: {
                    text: oneforall.user.username
                }
            }
            await message.channel.send({ embeds: [embed] })
        }
        if (subCommand === 'info') {
            const backupId = args[1]
            const backupData = userBackups.find(backup => backup.id === backupId)
            if (!backupData) return oneforall.functions.tempMessage(message, lang.backup.backupNotFound)
            const channels = backupData.channels.categories.map(category => category.children)
            const embed = {
                ...oneforall.embed(guildData),
                title: `Information de la backup ${backupId}`,
                description: `Server Name - **${backupData.name}**\nNombres de roles - **${backupData.roles.length}**\nNombre d'emojis - **${backupData.emojis.length}**\nNombre de catégories - ** ${backupData.channels.categories.length}**\n Nombre de channels - **${channels.length}**\n Nombre de bannis - **${backupData.bans.length}**\n Backup créé le <t:${oneforall.functions.dateToEpoch(new Date(backupData.createdTimestamp))}:R>`,
                footer: {
                    text: oneforall.user.username
                }
            }
            await message.channel.send({ embeds: [embed] })
        }
    }
}
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
        const userBackups = oneforall.managers.backupsManager.getAndCreateIfNotExists(message.author.id, {
            userId: message.author.id
        })
        if (subCommand === 'create') {
            let backupRoles = args.includes('roles')
            let backupEmojis = args.includes('emojis')
            let backupChannels = args.includes('channels')
            let backupBans = args.includes('bans')
            const doNotBackup = [!backupRoles ? "roles" : null, !backupEmojis ? "emojis" : null, !backupChannels ? "channels" : null, !backupBans ? "bans" : null]
            const loading = await message.channel.send('Creating the backup...')
            backup.create(message.guild, {
                maxMessagesPerChannel: 0,
                jsonSave: false,
                jsonBeautify: true,
                doNotBackup
            }).then(backupData => {
                userBackups.backups.push(backupData)
                userBackups.save().then(() => {
                    loading.edit({content: lang.backup.create.success(backupData.id)})
                })
            })
        }
        if (subCommand === 'load') {
            const backupId = args[1]
            const backupData = userBackups.backups.find(backup => backup.id === backupId)
            if (!backupData) return oneforall.functions.tempMessage(message, lang.backup.backupNotFound)
            await backup.load(backupData, message.guild, {
                clearGuildBeforeRestore: true
            }).catch(() => { }).then(() => oneforall.functions.tempMessage(message, 'Backup loaded'))
        }
        if (subCommand === 'delete') {
            const backupId = args[1]
            const backupData = userBackups.backups.find(backup => backup.id === backupId)
            if (!backupData) return oneforall.functions.tempMessage(message, lang.backup.backupNotFound)
            userBackups.backups = userBackups.backups.filter(backup => backup.id !== backupData.id)
            userBackups.save().then(() => {
                oneforall.functions.tempMessage(message, lang.backup.delete.success(backupId))
            })
        }
        if (subCommand === 'list') {
            if (!userBackups.backups.length) return oneforall.functions.tempMessage(message, 'No backups')
            const backupsName = [];
            const backupsId = [];
            for (const backup of userBackups.backups) {
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
            const backupData = userBackups.backups.find(backup => backup.id === backupId)
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

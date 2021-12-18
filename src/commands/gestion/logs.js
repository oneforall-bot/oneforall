module.exports = {
    data: {
        name: 'logs',
        description: 'Set the logs for the server',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'set',
                description: 'Set the logs',
                options: [
                    {
                        name: 'logs',
                        description: 'The logs to set the channel on',
                        type: 'STRING',
                        required: true,
                        choices: [
                            {
                                name: 'voice',
                                value: 'voice'
                            },
                            {
                                name: 'message',
                                value: 'message'
                            },
                            {
                                name: 'moderation',
                                value: 'moderation'
                            },
                            {
                                name: 'antiraid',
                                value: 'antiraid'
                            },
                        ]
                    },
                    {
                        name: 'channel',
                        description: 'The channel to set the log on',
                        required: true,
                        type: 'CHANNEL'
                    },
                ]
            },
            {
                name: 'show',
                description: 'Show the current logs configuration',
                type: 'SUB_COMMAND'
            },
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("SETLOGS_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return await message.editReply({content: lang.notEnoughPermissions('setlogs')})
        if (message.options.getSubcommand() === 'show') {
            const embed = {
                timestamp: new Date(),
                color: guildData.embedColor,
                title: `Configuration of logs`,
                description: `**Message:** ${guildData.logs.message ? `<#${guildData.logs.message}>` : 'Non définie'}\n**Moderation:** ${guildData.logs.moderation ? `<#${guildData.logs.moderation}>` : 'Non définie'}\n**Antiraid:** ${guildData.logs.antiraid ? `<#${guildData.logs.antiraid}>` : 'Non définie'}\n**Voice:** ${guildData.logs.voice ? `<#${guildData.logs.voice}>` : 'Non définie'}`,
                footer: {
                    text: `Logs`,
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                },
            }
            return message.editReply({embeds: [embed]})
        }
        const {channel} = message.options.get('channel')
        const logs = message.options.get('logs').value
        if (!channel.isText()) {
            return message.editReply({content: lang.logs.notText})
        }
        guildData.logs[logs] = channel.id
        guildData.save().then(() => {
            message.editReply({content: lang.logs.success(logs, channel.toString())})
        })
    }
}

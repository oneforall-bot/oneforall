module.exports = {
    data: {
        name: 'piconly',
        description: 'Manage the piconly feature',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'add',
                description: 'Add a piconly channel',
                options: [
                    {
                        type: 'CHANNEL',
                        name: 'channel',
                        description: 'The channel to set the only image on',
                        required: true
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'remove',
                description: 'Remove a piconly channel',
                options: [
                    {
                        type: 'CHANNEL',
                        name: 'channel',
                        description: 'The channel to remove the only image on',
                        required: true
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'list',
                description: 'List the piconly channels',
            },
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("PICONLY_CMD")
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions('piconly')})

        const {options} = message

        const subCommand = options.getSubcommand()
        if(subCommand === 'list'){
            const embedChange = (page, slicerIndicatorMin,  slicerIndicatorMax, totalPage) => {
                return {
                    ...oneforall.embed(guildData),
                    title: `All piconly channels (${guildData.piconly.length})`,
                    footer: {
                        text: `Page ${page + 1}/${totalPage ||1}`
                    },
                    description: guildData.piconly.map((id, i) => {
                        return `\`${i+1}\` - <#${id}> **(${id})**`
                    }).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

                }
            }
            return await new oneforall.DataMenu(guildData.piconly, embedChange, message, oneforall).sendEmbed()
        }
        const channel = options.getChannel('channel', false)
        if(!channel.isText()) return message.editReply({content: lang.piconly.wrongType})
        if(guildData.piconly.includes(channel.id) && subCommand === 'add') return message.editReply({content: lang.piconly.alreadyPiconly})
        if(!guildData.piconly.includes(channel.id) && subCommand === 'remove') return message.editReply({content: lang.piconly.notPiconly})
        subCommand === 'add' ? guildData.piconly.push(channel.id) : guildData.piconly = guildData.piconly.filter(id => id !== channel.id)
        guildData.save().then(() =>{
            message.editReply({content: lang.piconly.success(channel.toString())})
        })

    }
}

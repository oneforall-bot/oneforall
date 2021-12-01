module.exports = {
    data: {
        name: 'all',
        description: 'Get all information about member',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'admins',
                description: 'Get all the admins of the server',
                options: [
                    {
                        type: 'BOOLEAN',
                        name: 'bot',
                        description: 'Whether to include bot or not'
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'bots',
                description: 'Get all the admins of the server'
            },
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const {options} = interaction;
        const subCommand = options.getSubcommand()
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has('ALL_CMD')
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission) return interaction.editReply({content: lang.notEnoughPermissions(`all`)})
        if(subCommand === 'admins'){
            const bot = options.getBoolean('bot', false) ?? true
            const admins = (await interaction.guild.members.fetch()).filter(member => member.permissions.has('ADMINISTRATOR') && bot ? true : member.user.bot === false)
            const embedChange = (page, slicerIndicatorMin,  slicerIndicatorMax, totalPage) => {
                let i = 0
                return {
                    ...oneforall.embed,
                    title: `All admins (${admins.size})`,
                    footer: {
                        text: `Page ${page + 1}/${totalPage ||1}`
                    },
                    description: admins.mapValues((member) => {
                        i++
                        return `${i} - ${member.toString()} **(${member.id})**`
                    }).toJSON().slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

                }
            }
           await new oneforall.DataMenu(admins, embedChange, interaction, oneforall).sendEmbed()
        }
        if(subCommand === 'bots'){
            const bots = (await interaction.guild.members.fetch()).filter(member => member.user.bot)
            const embedChange = (page, slicerIndicatorMin,  slicerIndicatorMax, totalPage) => {
                let i = 0
                return {
                    ...oneforall.embed,
                    title: `All bots (${bots.size})`,
                    footer: {
                        text: `Page ${page + 1}/${totalPage ||1}`
                    },
                    description: bots.mapValues((member) => {
                        i++
                        return `${i} - ${member.toString()} **(${member.id})**`
                    }).toJSON().slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'

                }
            }
            await new oneforall.DataMenu(bots, embedChange, interaction, oneforall).sendEmbed()
        }
    }
}

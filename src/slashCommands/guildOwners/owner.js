const {DataMenu} = require("../../structures/OneForAll");
module.exports = {
    data: {
        name: 'owner',
        description: 'Manage the owners on the guild',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'add',
                description: 'Add a member to the guild owner',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to add to the owner list',
                        required: true
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'remove',
                description: 'Remove a member to the guild owner',
                options: [
                    {
                        type: 'USER',
                        name: 'member',
                        description: 'The member to remove to the owner list',
                        required: true
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'list',
                description: 'List the owners list',
            }
        ]
    },
    guildCrownOnly: true,
    run: async (oneforall, interaction, memberData, guildData) => {
        const subCommand = interaction?.options.getSubcommand()
        const lang = guildData.langManager
        let { guildOwners } = guildData
        await interaction.deferReply({ephemeral: true})
        const user = interaction?.options.getUser('member')
        if(subCommand === 'add'){
            const isOwner = guildOwners.includes(user.id)
            if(isOwner) return interaction.editReply({content: lang.owners.add.alreadyOwner})
            guildData.guildOwners.push(user.id)
            guildData.save().then(() => {
                interaction.editReply({content: lang.owners.add.success(user.toString())})
            })
        }
        if(subCommand === 'remove'){
            const isOwner = guildOwners.includes(user.id)
            if(!isOwner) return interaction.editReply({content: lang.owners.remove.notOwner})
            guildData.guildOwners = guildData.guildOwners.filter(id => id !== user.id)
            guildData.save().then(() => {
                interaction.editReply({content: lang.owners.remove.success(user.toString())})
            })
        }
        if(subCommand === 'list'){
            const embedChange = (page, slicerIndicatorMin,  slicerIndicatorMax, totalPage) => {
                return {
                    ...oneforall.embed,
                    title: `Owner list (${guildOwners.length})`,
                    footer: {
                      text: `Owner Page ${page + 1}/${totalPage ||1}`
                    },
                    description: guildOwners.map((id, i) => `${i+1} - <@${id}>`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n') || 'No data'
                }
            }
            const menu = new oneforall.DataMenu(guildOwners,embedChange, interaction, oneforall)
            await menu.sendEmbed()
        }
    }
}

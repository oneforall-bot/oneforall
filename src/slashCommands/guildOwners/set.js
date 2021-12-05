const colorNameToHex = require("colornames");
module.exports = {
    data: {
        name: 'set',
        description: 'Change some data of the bot',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'color',
                description: 'Change embed color of the bot',
                options: [
                    {
                        type: 'STRING',
                        name :'color',
                        description: 'The color to change (hex or english color)',
                        required: true,

                    }
                ]
            }
        ]
    },
    guildOwnersOnly: true,
    run: async (oneforall, interaction, memberData, guildData) => {
        const {options} = interaction
        const subCommand = options.getSubcommand()
        if(subCommand === 'color'){
            const color = options.getString('color')
            const validColor = colorNameToHex(color.toLowerCase()) || color
            if(!validColor || !oneforall.functions.hexColorCheck(validColor)) return interaction.reply({content: guildData.langManager.set.color.notValid(color), ephemeral: true})
            guildData.embedColor = validColor
            guildData.save().then(() => {
                interaction.reply({embeds: [guildData.langManager.set.color.success(validColor)]})
            })


        }
    }
}

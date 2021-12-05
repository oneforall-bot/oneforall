module.exports = {
    data: {
        name: "set",
        description:'Set changes on the bot',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'color',
                description: 'Change the color of the embeds',
                options: [
                    {
                        name: 'color',
                        description: 'The color to change',
                        required: true,
                        type: 'STRING',
                        choices: [
                            {
                                value: 'red',
                                name: 'red'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    guildOwnersOnly: true,
    run: async (oneforall, interaction, memberData, guildData) => {
        const  {options} = interaction
        const subCommand = options.getSubcommand()
        const color = options.getString('color')
        console.log(color)
    }
}

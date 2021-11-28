const {MessageActionRow, MessageButton} = require("discord.js");
module.exports = {
    data: {
        name: 'help',
        description: 'Get the help',
        options: [
            {
                type: 'STRING',
                description: 'A specific command to get help for',
                name: 'command',
            }
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const {options} = interaction
        let command = oneforall.handlers.slashCommandHandler.slashCommandList.get(options?.getString("command")?.toLowerCase())
        await interaction.deferReply({ephemeral: true})

        let embed = {
            title: `Help on ${interaction.guild.name}`,
            description: '> *All bot is in slash command so prefix is /*',
            footer: {
                icon_url: interaction.user.displayAvatarURL({dynamic: true}) || ''
            },
            timestamp: new Date(),
            color: '#393B48',

        }
        if (command) {
            command = {...command.data}
            embed.title = 'Help for the command' + command.name
            embed.fields = [
                {
                    name: 'Name:',
                    value: command.name,
                    inline: true
                },
                {
                    name: 'Description:',
                    value: command.description,
                    inline: true
                },
            ]
            if (command.options)
                embed.fields.push({
                    name: 'Options:',
                    value: command.options.map(option => `${option.name} - ${option.description} - Required: ${option.required ? '\`✅\`' : '\`❌\`'}`).join('\n')
                })
            await interaction.editReply({embeds: [embed]})

        } else {
            const commandFolder = oneforall._fs.readdirSync('./src/slashCommands/').filter(file => !file.endsWith('.js'))
            embed.fields = commandFolder.map(folder => {
                return {
                    name: folder.toUpperCase(),
                    value: oneforall._fs.readdirSync(`./src/slashCommands/${folder}`).map(file => `\`${file.split('/').pop().split('.')[0]}\``).join(', ')
                }
            })
            await interaction.editReply({embeds: [embed]})
        }


    }
}

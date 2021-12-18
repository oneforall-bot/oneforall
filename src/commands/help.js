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
    run: async (oneforall, message, memberData, guildData) => {
        const {options} = message
        let command = oneforall.handlers.slashCommandHandler.slashCommandList.get(options?.getString("command")?.toLowerCase())
        await message.deferReply({ephemeral: true})

        let embed = {
            title: `Help on ${message.guild.name}`,
            description: '> *All bot is in slash command so prefix is /*',
            footer: {
                icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
            },
            timestamp: new Date(),
            color: guildData.embedColor,

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
            await message.editReply({embeds: [embed]})

        } else {
            const commandFolder = oneforall._fs.readdirSync('./src/slashCommands/').filter(file => !file.endsWith('.js'))
            embed.fields = commandFolder.map(folder => {
                return {
                    name: folder.toUpperCase(),
                    value: '> ' + oneforall._fs.readdirSync(`./src/slashCommands/${folder}`).map(file => `\`${file.split('/').pop().split('.')[0]}\``).join(', ')
                }
            })

        let help = {
            title: `All Available Commands`,
            description: '> *All bot is in slash command so prefix is \`/\`*',
            footer: {
                icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
            },
            fields: [
                {
                    name: '<:gestion:917030086627180544> __**Gestion**__:',
                    value: `\`autorole\`, \`backup\`, \`counter\`, \`embed\`, \`giveaway\`, \`massrole\`, \`reactrole\`, \`setlogs\`, \`soutien\`, \`piconly\`, \`tempvoc\`, \`unrank\`, \`setup\``
                },
                {
                    name: '<:guildowner:917030845540347924> __**GuildOwner**__:',
                    value: `\`group\`, \`owner\`, \`perm\`, \`antiraid\`, \`blacklist\``
                },
                {
                    name: '<:moderation:917031239955914803> __**Moderation**__:',
                    value: `\`ban\`, \`kick\`, \`lock\`, \`mute\`, \`renew\`, \`unban\`, \`bring\``
                },
                {
                    name: '<:general:917031771181297684> __**General**__:',
                    value: `\`addbot\`, \`all\`, \`avatar\`, \`clear\`, \`emoji\`, \`info\`, \`invite\`, \`leaderboard\`, \`ping\`, \`snipe\`, \`vc\`, \`poll\`\n\n[<:oneforall:801047039751880755> Invite Bot](https://discord.com/api/oauth2/authorize?client_id=912445710690025563&permissions=8&scope=bot%20applications.commands)\n[<:Discord:917033803615207434> Support Server](https://discord.gg/n2EvRECf88)\n[<:778353230484471819:780727288903237663> Documentation](https://takefy.gitbook.io/oneforall/)\nUse \`/help command:commandname\` for more info about a specific command.`
                }
            ],
            timestamp: new Date(),
            color: guildData.embedColor,

        }
            await message.editReply({embeds: [help]})
        }


    }
}

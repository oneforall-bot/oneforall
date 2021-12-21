const { Message, Collection, MessageEmbed } = require('discord.js')
const OneForAll = require('../structures/OneForAll')
module.exports = {
    name: "help",
    aliases: [],
    description: "",
    usage: "",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: [],
    guildOwnersOnly: false,
    guildCrownOnly: false,
    ownersOnly: false,
    cooldown: 0,
    /**
    * 
    * @param {OneForAll} oneforall
    * @param {Message} message 
    * @param {Collection} memberData 
    * @param {Collection} guildData 
    * @param {[]} args
    */
    run: async (oneforall, message, guildData, memberData, args) => {
        const lang = guildData.langManager
        const category = await oneforall._fs.readdirSync('./src/commands').filter(folder => !folder.endsWith('.js'))
        const commandWithCat = []

        for await (const cat of category) {
            const commandsFiles = await oneforall._fs.readdirSync('./src/commands/' + cat).filter(folder => folder.endsWith('.js'))
            const t = {}
            t[cat] = []
            commandsFiles.forEach(file => {
                const command = require(`./${cat}/${file}`)
                if (command.name)
                    t[cat].push(command.usage || command.name)
                delete require.cache[`./${cat}/${file}`];
            })
            commandWithCat.push(t)
        }

        const helpEmbed = {
            fields: commandWithCat.map(cmdCat => {
                return {
                    name: Object.keys(cmdCat)[0].toUpperCase() + ':',
                    value: Object.values(cmdCat)[0].map(cmd => `\`${cmd}\``).join(', ')
                }
            }),
            color: guildData.embedColor,
            timestamp: new Date(),
            thumbnail: {
                url: `https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`
            },
            author: {
                name: lang.help.information, icon_url: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`
            },
            footer: {
                text: lang.help.information, icon_url: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`
            }

        }

        if (args[0] && args[0].includes('@')) return message.channel.send({ embeds: [helpEmbed] })
        if (args[0]) {
            const cmd = oneforall.handlers.commandHandler.commandList.get(args[0].toLowerCase().normalize()) || await oneforall.handlers.commandHandler.aliases.get(args[0].toLocaleLowerCase().normalize());

            if (!cmd) return message.channel.send(lang.help.noCommand(args[0])).then((mp) => mp.delete({ timeout: 4000 }))
            const prefix = guildData.prefix
            const embed = new MessageEmbed()
                .setTitle(`${cmd.name} command`)
                .setDescription(lang.help.requiredOrNot)
                .setThumbnail(`https://media.discordapp.net/attachments/780360844696616962/818128852105691166/ddw3h8b-5dd50e8b-32f3-4d51-9328-e55cab4aa546.gif`)
                .addField('ALIASES', cmd.aliases.length < 1 ? lang.help.noAliases : cmd.aliases.join(', '), true)
                .addField('COOLDOWN:', `${cmd.cooldown / 1000}s`, true)
                .addField('DESCRIPTION:', cmd.description, false)
                .addField('USAGE:', cmd.usage === '' ? lang.help.noUsage : `${prefix}${cmd.usage}`, true)
                .addField('Client Permissions', cmd.clientPermissions.length < 1 ? 'Aucune' : cmd.clientPermissions.join(', '), true)
                .addField('OneForAll Permissions', cmd.ofaPerms.length < 1 ? 'Aucune' : cmd.ofaPerms.join(', '), true)
                .setColor(guildData.embedColor)
                .setFooter(`${lang.help.footer} ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            return message.channel.send({ embeds: [embed] })
        }
        message.channel.send({ embeds: [helpEmbed] })
    }
}
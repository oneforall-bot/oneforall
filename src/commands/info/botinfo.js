const { Message, Collection, MessageEmbed } = require('discord.js')
const { version } = require('../../../package.json'),
    { utc } = require('moment'),
    { version: djsversion } = require('discord.js'),
    os = require('os'),
    ms = require('ms')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "botinfo",
    aliases: ["infobot"],
    description: "Get the information of the bot | Avoir les information sur le bot",
    usage: "botinfo",
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    ofaPerms: ['INFO_CMD'],
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
        const takefy = await oneforall.users.fetch('708047733994553344')
        const baby = await oneforall.users.fetch('659038301331783680')
        const guildCount = (await oneforall.shard.fetchClientValues("guilds.cache.size")).reduce((acc, memberCount) => acc + memberCount, 0)
        const channelCount = (await oneforall.shard.fetchClientValues('channels.cache.size')).reduce((acc, channelCount) => acc + channelCount, 0)
        const userCount = (await oneforall.shard.broadcastEval(client => client.guilds.cache.filter(g => g.available).reduce((acc, guild) => acc + guild.memberCount, 0))).reduce((acc, prev) => acc + prev, 0)

        const core = os.cpus()[0];
        const fields = [
            [
                `Date de création: <t:${oneforall.functions.dateToEpoch(oneforall.user.createdAt)}:R>`,
                `Developers: **${takefy.username}#${takefy.discriminator}, ${baby.username}#${baby.discriminator}**`,
                `Node.js: **${process.version}**`,
                `Version: **v${version}**`,
                `Discord.js: **v${djsversion}**`,
                `Bot Uptime: **${ms(oneforall.uptime)}**`,
                '\u200b'
            ],
            [
                `Serveurs: **${guildCount.toLocaleString()}** `,
                `Users: **${userCount.toLocaleString()}**`,
                `Channels: **${channelCount.toLocaleString()}**`,
                '\u200b'
            ],
            [
                `Platforme: **${process.platform}**`,
                `Uptime: **${ms(os.uptime() * 1000, { long: true })}**`,
                `CPU:`,
                `\u3000 Coeurs: **${os.cpus().length}**`,
                `\u3000 Modèle: **${core.model}**`,
                `\u3000 Vitesse: **${core.speed}**MHz`,
            ]
        ]
        const embedBot = new MessageEmbed()
            .setThumbnail(oneforall.user.displayAvatarURL())
            .setTitle(`${oneforall.user.tag} <:online_il:786325180070625311>`)
            .setColor(guildData.embedColor)
            .addField('<a:fleche:786340501531262977> **INFORMATIONS:**', fields[0].join('\n'))
            .addField('<a:fleche:786340501531262977> **STATISTICS:**', fields[1].join('\n'))
            .addField('<a:fleche:786340501531262977> **SYSTEM:**', fields[2].join('\n'))

    
            .setFooter(oneforall.user.username)
            .setTimestamp();
        message.channel.send({embeds: [embedBot]})
    }
}
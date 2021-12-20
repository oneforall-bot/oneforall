const { Message, Collection, Permissions } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "unban",
    aliases: ["deban"],
    description: "Unban a user or all banned users | Unban un utilisateur ou tout les membres bannis",
    usage: "unban <member/all>",
    clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.BAN_MEMBERS],
    ofaPerms: ["UNBAN_CMD"],
    cooldown: 1000,
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
        const user = args[0] === 'all' ? 'all' : args[0] ? (await oneforall.users.fetch(args[0]).catch(() => { })) || message.mentions.users.first() : undefined    
        if (user !== 'all') {
            try {
                await message.guild.bans.fetch(user.id)
            } catch (e) {
                return oneforall.functions.tempMessage(message, lang.unban.notBan(user.username))
            }
            await message.guild.bans.remove(user, `Unban by ${message.author.username}#${message.author.discriminator}`).then(() => {
                oneforall.functions.tempMessage(message, lang.unban.success(user.username))
            })
            const roleLogs = guildData.logs.moderation
            const channel = message.guild.channels.cache.get(roleLogs);
            const { logs } = oneforall.handlers.langHandler.get(guildData.lang);
            const { template } = logs
            if (!channel) return
            channel.send({ embeds: [template.guild.unban(message.member, user)] })
        }
        if (user === 'all') {
            const banned = await message.guild.bans.fetch()
            if (banned.size < 1) return oneforall.functions.tempMessage({ content: "Personne n'est banni" })
            for await (const [_, ban] of banned) {
                await message.guild.bans.remove(ban.user.id)
            }
            oneforall.functions.tempMessage(message, `Unbanned **${banned.size}** members`)
        }

    }
}
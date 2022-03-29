const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "massrole",
    aliases: [],
    description: "Add or remove a role to multiple members | Ajouter ou supprimer un role à plusieurs membres ",
    usage: "massrole <add/remove> <role> [humans/bot]",
    clientPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    ofaPerms: [],
    guildOwnersOnly: false,
    guildCrownOnly: false,
    ownersOnly: false,
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
        const subCommand = args[0]
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has(`MASSROLE_${subCommand.toUpperCase()}_CMD`);
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
        if(!role) return oneforall.functions.tempMessage(message, lang.massrole.missingRole)
        const humans = args[2] === 'humans'
        const bot = args[2] === 'bot' 
        const roleHasSensiblePermissions = oneforall.functions.roleHasSensiblePermissions(role.permissions)
        const oneforallHighestRole = message.guild.me.roles.highest.position
        if (!hasPermission || roleHasSensiblePermissions || role.managed || oneforallHighestRole < role.position) {
            return oneforall.functions.tempMessage(message,
                !hasPermission ? lang.notEnoughPermissions(`massrole ${subCommand}`) : role.managed ? lang.roleManaged : oneforallHighestRole < role.position ? lang.roleSuppThanClient : lang.roleHasSensiblePermissions
            );

        }
        const members = await message.guild.members.fetch()
        if (role.managed) return oneforall.functions.tempMessage(message, lang.roleManaged)
        const membersToEdit = members.filter(member => (subCommand === 'add' ? !member.roles.cache.has(role.id) : member.roles.cache.has(role.id)) && (bot && !humans ? member.user.bot : !bot && humans ? !member.user.bot : true))
        if (membersToEdit.size < 1) return oneforall.functions.tempMessage(message, lang.massrole.notMembersToEdit)
        for await (const [id, member] of membersToEdit)
            member.roles[subCommand](role, `Massrole ${subCommand} by ${message.author.username}#${message.author.discriminator}`)
        await oneforall.functions.tempMessage(message, lang.massrole.success(role.name, membersToEdit.size, subCommand))
    }
}
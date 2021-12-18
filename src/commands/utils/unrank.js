const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "unrank",
    aliases: ["derank"],
    description: "Unrank a member with sensible permissions",
    usage: "",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: ["UNRANK_CMD"],
    cooldown: 0,
    /**
    * 
    * @param {OneForAll} oneforall
    * @param {Message} message 
    * @param {Collection} memberData 
    * @param {Collection} guildData 
    * @param {[]} args
    */
    run: async (oneforall, message, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("UNRANK_CMD");
        await message.deferReply({ ephemeral: true });
        if (!hasPermission)
            return message.editReply({
                content: lang.notEnoughPermissions('unrank')
            });
        const member = message.options.getMember('member')
        if (!member.manageable) return message.editReply({ content: lang.unrank.memberNotManageable });
        const rolesToRemove = member.roles.cache.filter(role => oneforall.functions.roleHasSensiblePermissions(role.permissions) && role.editable && !role.managed && role.id !== message.guild.roles.everyone.id)
        rolesToRemove.forEach(role => member.roles.remove(role, `Derank by ${message.author.tag}`))
        await message.editReply({
            content: lang.unrank.success(member.toString(), rolesToRemove.size),
        })
    }
}

module.exports = async (oneforall, reaction, user) => {
    if (user.bot) return;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(reaction.message.guild.id, {
        guildId: reaction.message.guild.id
    });
    const reactRoles = guildData.reactroles;
    if (reactRoles.length < 1) return
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    const reactRole = reactRoles.find(reactRole => reactRole.message === reaction.message.id);
    if (reactRole) {

        const {emojiRoleMapping} = reactRole;
        let role;
        if (reaction.emoji.name && emojiRoleMapping.hasOwnProperty(reaction.emoji.name)) {

            role = reaction.message.guild.roles.cache.get(emojiRoleMapping[reaction.emoji.name])
        } else if (reaction.emoji.id && emojiRoleMapping.hasOwnProperty(reaction.emoji.id)) {

            role = reaction.message.guild.roles.cache.get(emojiRoleMapping[reaction.emoji.id])
        } else {
            return
        }
        let member = await reaction.message.guild.members.fetch(user.id);
        if (role && member) {
            member.roles.remove(role, 'Reaction role remove')

        }

    }
}

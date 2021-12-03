module.exports = async (oneforall, reaction, user) => {
    if (user.bot) return;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(reaction.message.guild.id, {
        guildId: reaction.message.guild.id
    });
    const reactRoles = guildData.reactroles;
    if (reactRoles.length < 1) return
    if (reaction.message.partial) await reaction.message.fetch();
    console.log("1")
    if (reaction.partial) await reaction.fetch();
    console.log("2")
    const reactRole = reactRoles.find(reactRole => reactRole.message === reaction.message.id);
    if (reactRole) {
        console.log("3")

        const {emojiRoleMapping} = reactRole;
        let role;
        if (reaction.emoji.name && emojiRoleMapping.hasOwnProperty(reaction.emoji.name)) {
            console.log("5 name")

            role = reaction.message.guild.roles.cache.get(emojiRoleMapping[reaction.emoji.name])
        } else if (reaction.emoji.id && emojiRoleMapping.hasOwnProperty(reaction.emoji.id)) {
            console.log("5 id")

            role = reaction.message.guild.roles.cache.get(emojiRoleMapping[reaction.emoji.id])
        } else {
            return console.log("5 return")
        }
        let member = await reaction.message.guild.members.fetch(user.id);
        if (role && member) {
            console.log('no member or role', role?.name, member?.id)
            await member.roles.remove(role, 'Reaction role remove')

        }

    }
}

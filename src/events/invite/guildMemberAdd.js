const moment = require('moment')
module.exports = async (oneforall, member) => {
    const {guild} = member;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
        guildId: guild.id
    })
    const {invites} = guildData;
    const {channel, message, enable} = invites;

    if (!channel || !message || !enable) return
    const welcomeChannel = guild.channels.cache.get(channel)
    const lang = oneforall.handlers.langHandler.get(guildData.lang)
    const cachedInv = oneforall.cachedInv.get(guild.id)
    const newInv = await guild.invites.fetch()
    const tempMap = new oneforall.Collection()
    for(const [code, invite] of newInv) tempMap.set(code, invite.uses)
    const usedInv = newInv.find(inv => {
        return cachedInv.get(inv.code) < inv.uses
    });

    console.log(usedInv)
    let finalMsg =  lang.invite.cantTrace(member.toString());
    if (!usedInv) {
        if (guild.vanityURLCode) finalMsg = lang.invite.vanity(member.toString())
        if (member.user.bot) finalMsg = lang.invite.oauth(member.toString())
    } else {
        const fake = (Date.now() - member.createdAt) / (1000 * 60 * 60 * 24) <= 3;
        let inviter = await guild.members.fetch(usedInv.inviter.id);
        if (inviter) {
            const userData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${usedInv.inviter.id}`, {
                guildId: guild.id,
                memberId: usedInv.inviter.id
            })

            let {invites} = userData;
            invites.join += 1;
            if (fake) invites.fake += 1;
            userData.save()
            const invitedData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`, {
                guildId: guild.id,
                memberId: member.id
            });
            invitedData.invites.invitedBy = inviter.id
            invitedData.save()
            let join = invites.total?.toString() || invites.join.toString();
            let memberTotal = guild.memberCount.toString()

            finalMsg = message.replace(/{invitedMention}/g, member).replace(/{inviterTag}/g, inviter.user.tag || `${inviter.user.username}#${inviter.user.discriminator}`).replace(/{count}/g, join).replace(/{memberTotal}/g, memberTotal).replace(/{invitedTag}/g, member.user.tag || member.user.username).replace(/{inviterMention}/g, inviter).replace(/{fake}/g, invites.fake).replace(/{leave}/g, invites.leave).replace(/{creation}/g, moment(member.user.createdAt).format("DD/MM/YYYY"));
        }

    }
    if (welcomeChannel && !welcomeChannel.deleted) welcomeChannel.send(finalMsg)

}

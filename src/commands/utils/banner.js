const { Message, Collection, MessageEmbed } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "banner",
    aliases: [],
    description: "Show the bann of a user || Affiche la bannière d'un utilisateur",
    usage: "banner <member>",
    clientPermissions: ['SEND_MESSAGES', 'EMBED_MESSAGES'],
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
        const user = (await message.mentions.users.first()?.fetch({force: true})) || (await oneforall.users.fetch(args[0] || message.author.id, {force: true}))
        const bannerURL = user.bannerURL({ size: 512, dynamic: true }).replace(".webp", ".png");
        if(!bannerURL) return
        const embed = new MessageEmbed()
            .setTitle(user.tag)
            .setImage(bannerURL)
            .setColor(guildData.embedColor)
            .setTimestamp()
            .setFooter(oneforall.user.username)
        await message.channel.send({ embeds: [embed] });
    }
}

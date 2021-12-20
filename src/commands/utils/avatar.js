const { Message, Collection, MessageEmbed } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "avatar",
    aliases: ["pic", "pp"],
    description: "Show the avatar of a user || Affiche l'avatar d'un utilisateur",
    usage: "avatar <member>",
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
        const user = message.mentions.users.first() || (await oneforall.users.fetch(args[0] || message.author.id))
        const avatarURL = user.displayAvatarURL({ size: 512, dynamic: true }).replace(".webp", ".png");
        const embed = new MessageEmbed()
            .setTitle(user.tag)
            .setImage(avatarURL)
            .setColor(guildData.embedColor)
            .setTimestamp()
            .setFooter(oneforall.user.username)
        await message.channel.send({ embeds: [embed] });
    }
}

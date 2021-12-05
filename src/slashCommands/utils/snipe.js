const {MessageEmbed} = require("discord.js");
module.exports = {
    data: {
        name: 'snipe',
        description: 'Get the last message delete in the channel'
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const snipedMessage = oneforall.snipes.get(interaction.channelId)
        if (!snipedMessage) return interaction.reply({content: 'No sniped message', ephemeral: true})
        if (oneforall.functions.isLink(snipedMessage.content)) snipedMessage.content = 'Link ***'
        const embed = new MessageEmbed()
            .setAuthor(snipedMessage.author.tag, snipedMessage.author.displayAvatarURL({dynamic: true, size: 256}))
            .setDescription(snipedMessage.content)
            .setFooter(`${oneforall.user.username} | Date: ${snipedMessage.date}`)
            .setColor(guildData.embedColor)
        if (snipedMessage.image) embed.setImage(snipedMessage.image)
        interaction.reply({embeds: [embed], ephemeral: true})
    }
}

const {MessageEmbed} = require("discord.js");
module.exports = {
    data: {
        name: 'avatar',
        description: 'Get the avatar of a user',
        options: [
            {
                type: 'USER',
                name: 'user',
                description: 'The user to get the avatar',
                required: true
            }
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const { user } = interaction.options.get('user')
        const avatarURL = user.displayAvatarURL({size: 512, dynamic: true}).replace(".webp", ".png");
        const embed = new MessageEmbed()
            .setTitle(user.tag)
            .setImage(avatarURL)
            .setColor('#36393E')
            .setTimestamp()
            .setFooter(oneforall.user.username)
        await interaction.reply({ephemeral: true,embeds: [embed]});
    }
}

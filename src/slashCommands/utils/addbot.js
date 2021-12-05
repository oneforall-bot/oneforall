module.exports = {
    data: {
        name: 'addbot',
        description: 'Get the bot invite'
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        interaction.reply({content: 'https://discord.com/api/oauth2/authorize?client_id=912445710690025563&permissions=8&scope=bot%20applications.commands', ephemeral: true})
    }
}

module.exports = {
    data: {
        name: 'ping',
        description: 'Show the ping of the bot'
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const msg = await interaction.reply({content: "🏓", fetchReply: true, ephemeral: true})
        await interaction.editReply({ephemeral: true,content: `Bot latency: \`${msg.createdTimestamp - interaction.createdTimestamp}\`ms, WS latency: \`${oneforall.ws.ping}\`ms`})
    }
}

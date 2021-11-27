const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
module.exports = {
    data: {
        name: 'counter',
        description: 'Manage counters on the server',
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has("COUNTER_CMD");
        await interaction.deferReply({ephemeral: (!!!hasPermission)});
        if (!hasPermission)
            return interaction.editReply({
                content: lang.notEnoughPermissions('counter')
            });
        const tempCouter = {...guildData.counters}
        const embed = {
            footer: {text: interaction.user.username, icon_url: interaction.user.displayAvatarURL(
                    {dynamic:true}
                )},
            ...oneforall.embed, ...lang.counter.embed(tempCouter.member, tempCouter.voice, tempCouter.online, tempCouter.offline,
                tempCouter.boostCount, tempCouter.boosterCount)
        }
        const components = [
            new MessageSelectMenu()
                .setOptions(lang.counter.selectMenu)
                .setPlaceholder('Choose an action')
                .setCustomId(`counter.${interaction.id}`),
            new MessageButton()
                .setCustomId(`valid.${interaction.id}`)
                .setEmoji('✅')
                .setStyle('SECONDARY')
        ]
        const componentFilter = {
                filter: interactionCollector => interactionCollector.customId.includes(interaction.id) && interactionCollector.user.id === interaction.user.id,
                time: 900000
            },
            awaitMessageFilter = {
                filter: response => response.author.id === interaction.user.id,
                time: 900000,
                limit: 1,
                max: 1,
                errors: ['time']
            }
        const collector = interaction.channel.createMessageComponentCollector(componentFilter)
        collector.on('collect', async(interactionCollector) => {
            await interactionCollector.deferUpdate()
            const selectedOption = interactionCollector.values[0]
            switch (selectedOption){

            }
        })
        await interaction.editReply({embeds: [embed], components: components.map(c => new MessageActionRow({components: [c]}))})
    }
}

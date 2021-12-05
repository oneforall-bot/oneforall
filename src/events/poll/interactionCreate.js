const {MessageEmbed} = require("discord.js");
const moment = require("moment");
const ms = require("ms");
module.exports = async (oneforall, interaction) => {
    if(!interaction.isButton()) return

    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(`${interaction.guildId}`, {
        guildId: interaction.guildId
    });
    const {polls} = guildData

    if(!polls.length) return interaction.deferUpdate()
    const poll = polls.find(poll => poll.id === interaction.message.id)
    if(poll.alreadyVoted.includes(interaction.user.id)) return interaction.reply({content: 'Vous avez déjà voté', ephemeral: true})

    if(interaction.customId.includes('yes')) poll.yes += 1
    if(interaction.customId.includes('no')) poll.no += 1
    poll.alreadyVoted.push(interaction.user.id)
    const embed = {
        ...oneforall.embed,
        title: poll.question,
        timestamp: poll.endAt,
        description: `${oneforall.handlers.langHandler.get(guildData.lang).yes}: **${poll.yes}** \`(${((poll.yes / (poll.yes + poll.no)) *  100).toFixed(0)}%)\`\n\n${oneforall.handlers.langHandler.get(guildData.lang).no}: **${poll.no}** \`(${((poll.no / (poll.yes + poll.no)) * 100).toFixed(0)}%)\`\n\nTemps restant: <t:${oneforall.functions.dateToEpoch(new Date(poll.endAt))}:R>`,
    }
    interaction.message.edit({embeds: [embed]})
    await interaction.deferUpdate()
    guildData.polls = polls
    guildData.save()
}

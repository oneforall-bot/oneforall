const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const {Message, Collection} = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
   name: "counter",
   aliases: ["compteur"],
   description: "Manage counters | Gerer les compteurs",
   usage: "counter",
   clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
   ofaPerms: ["COUNTER_CMD"],
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
    const lang = guildData.langManager
    
    const tempCouter = {...guildData.counters}
    const embed = {
        footer: {
            text: message.author.username, icon_url: message.author.displayAvatarURL(
                {dynamic: true}
            )
        },
        ...oneforall.embed(guildData), ...lang.counter.embed(tempCouter.member, tempCouter.voice, tempCouter.online, tempCouter.offline,
            tempCouter.boostCount, tempCouter.boosterCount)
    }
    const components = [
        new MessageSelectMenu()
            .setOptions(lang.counter.selectMenu)
            .setPlaceholder('Choose an action')
            .setCustomId(`counter.${message.id}`),
        new MessageButton()
            .setCustomId(`valid.${message.id}`)
            .setEmoji('✅')
            .setStyle('SECONDARY')
    ]
    const componentFilter = {
            filter: interaction => interaction.customId.includes(message.id) && interaction.user.id === message.author.id,
            time: 900000
        },
        awaitMessageFilter = {
            filter: response => response.author.id === message.author.id,
            time: 900000,
            limit: 1,
            max: 1,
            errors: ['time']
        }
    let selectedMenu
    const collector = message.channel.createMessageComponentCollector(componentFilter)
    collector.on('collect', async (interaction) => {
        if (interaction.componentType === 'BUTTON') {
            guildData.counters = tempCouter
            return guildData.save().then(async () => {
                for (const key in guildData.counters) {
                    if (guildData.counters[key]) {
                        const channel = message.guild.channels.cache.get(guildData.counters[key]?.channel)
                        if (channel) {
                            const value = key === 'member' ? message.guild.memberCount : key === 'voice' ? (await message.guild.members.fetch()).filter(member => member.voice.channelId).size
                                : key === 'online' ? (await message.guild.members.fetch({withPresences: true})).filter(member => member.presence?.status === 'online' || member.presence?.status === 'dnd' || member.presence?.status === 'idle').size :
                                    key === 'offline' ? (await message.guild.members.fetch({withPresences: true})).filter(member =>  member.presence?.status !== 'online' || member.presence?.status !== 'dnd' || member.presence?.status !== 'idle' ).size :
                                        key === 'boostCount' ? message.guild.premiumSubscriptionCount : (await message.guild.members.fetch()).filter(member => member.premiumSince).size
                            channel.edit({name:`${guildData.counters[key].name.replace('{count}', value.toLocaleString())}`
                        })
                        }
                    }
                }
                collector.stop()
                await panel.edit({content: lang.save, components:[], embeds:[]})
            })
        }
        const selectedOption = interaction.values[0]
        if (Object.keys(tempCouter).includes(selectedOption)) {
            components[0].setOptions(lang.counter.configMenu)
            selectedMenu = selectedOption
            return await interaction.editReply({components: components.map(c => new MessageActionRow({components: [c]}))})
        }
        switch (selectedOption) {
            case 'back':
                components[0].setOptions(lang.counter.selectMenu)
                await interaction.editReply({components: components.map(c => new MessageActionRow({components: [c]}))})
                break;
            default:
                const questionAnswer = await generateQuestion(lang.counter.configMenu.find(sl => sl.value === selectedOption)?.question)
                if (selectedOption === 'channel') {
                    if (questionAnswer.content === 'off') {
                         tempCouter[selectedMenu].channel = undefined
                        return updateEmbed()
                    }
                    const channel = questionAnswer.mentions.channels.first() || message.guild.channels.cache.get(questionAnswer.content)
                    if (!channel || !channel.isVoice()) return oneforall.functions.tempMessage(message, lang.counter.invalidChannel)
                    questionAnswer.content = channel.id
                } else {
                    if (!questionAnswer.content.includes('{count}')) return oneforall.functions.tempMessage(message, lang.counter.missingCount)
                }
                tempCouter[selectedMenu][selectedOption] = questionAnswer.content
                updateEmbed()


        }
    })

    async function generateQuestion(question) {
        const messageQuestion = await message.channel.send(question)
        components[0].setDisabled(true)
        await panel.edit({
            components: components.map(c => new MessageActionRow({components: [c]}))
        })
        const collected = await messageQuestion.channel.awaitMessages(awaitMessageFilter)
        await messageQuestion.delete()
        await collected.first().delete()
        components[0].setDisabled(false)
        await panel.edit({
            components: components.map(c => new MessageActionRow({components: [c]}))
        })
        return collected.first()
    }

    const panel = await message.channel.send({
        embeds: [embed],
        components: components.map(c => new MessageActionRow({components: [c]}))
    })

    function updateEmbed() {

        const embed = {
            footer: {
                text: message.author.username, icon_url: message.author.displayAvatarURL(
                    {dynamic: true}
                )
            },
            ...oneforall.embed(guildData), ...lang.counter.embed(tempCouter.member, tempCouter.voice, tempCouter.online, tempCouter.offline,
                tempCouter.boostCount, tempCouter.boosterCount)
        }
        panel.edit({
            embeds: [embed],
            components: components.map(c => new MessageActionRow({components: [c]}))
        })
    }
}
}

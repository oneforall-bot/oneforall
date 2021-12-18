const ms = require('ms')
const moment = require('moment')
const { MessageActionRow, MessageButton} = require("discord.js");
module.exports = {
    data: {
        name: 'poll',
        description: 'Create a poll',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'create',
                description: 'Create a poll',
                options: [
                    {
                        name: 'question',
                        description: 'The question to poll',
                        required: true,
                        type: 'STRING'
                    },
                    {
                        name: 'time',
                        description: 'The time the poll need to last',
                        required: true,
                        type: 'STRING'
                    },
                    {
                        name: 'channel',
                        description: 'The channel to send the poll',
                        required: false,
                        type: 'CHANNEL'
                    }

                ]
            }
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("POLL_CMD");
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions('poll')});
        const subCommand = message.options.getSubcommand()
        if(subCommand === 'create'){
            const question = message.options.getString('question')
            const time = message.options.getString('time')
            const channel = message.options.getChannel('channel', false) || message.channel
            if(!oneforall.functions.isValidTime(time)) return message.editReply({content: lang.incorrectTime})


            const embed = {
                ...oneforall.embed(guildData),
                title: question,
                description: `${lang.yes}: **0** \`(0%)\`\n\n${lang.no}: **0** \`(0%)\`\n\n Temps restant: <t:${oneforall.functions.dateToEpoch(new Date(moment().add(ms(time)).valueOf()))}:R>`,
                timestamp: moment().add(ms(time)).valueOf()
            }
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel(lang.yes)
                        .setCustomId(`poll.yes.${message.id}`)
                        .setStyle('SUCCESS')
                ).addComponents(
                    new MessageButton()
                        .setLabel(lang.no)
                        .setCustomId(`poll.no.${message.id}`)
                        .setStyle('DANGER')
                )
            const pollMessage = await channel.send({embeds: [embed], components: [row]})

            guildData.polls.push({question, endAt: moment().add(ms(time)).valueOf(), createdAt: Date.now(), channel: pollMessage.channel.id, id: pollMessage.id, yes: 0, no: 0, alreadyVoted: []})
            guildData.save().then(() => {
                message.editReply({content: 'Poll started'})
            })
        }
    }
}

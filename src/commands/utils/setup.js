const { Permissions } = require("discord.js");
const { Message, Collection } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "setup",
    aliases: [],
    description: "Setup the bot",
    usage: "setup <memberRole> <muteRole> [true/false (autosetup role mute in channels)]",

    clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_CHANNELS],
    guildOwnersOnly: true,
    cooldown: 1000,
    /**
    * 
    * @param {OneForAll} oneforall
    * @param {Message} message 
    * @param {[]} args
    */
    run: async (oneforall, message, guildData,memberData, args) => {
        const lang = guildData.langManager;
        const member = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        const mute = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
        if (!member || !mute) return oneforall.functions.tempMessage(message, lang.setup.invalideRoles)
        if (mute.id === message.guild.roles.everyone.id) return oneforall.functions.tempMessage(message, lang.setup.muteRoleEveryone)
        const needToSetup = args[2] || false
        guildData.member = member.id;
        guildData.mute = mute.id;
        guildData.setup = true
        guildData.save()
        if (!needToSetup) return oneforall.functions.tempMessage(message, 'oneforall is setup correctly')
        const channelToEdit = message.guild.channels.cache.filter(channel => (channel.isVoice() || channel.isText()) && (channel.permissionsFor(member.id).has(channel.isText() ? [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL] : channel.isVoice() ? [Permissions.FLAGS.CONNECT] : [])))
        if (channelToEdit.size > 0)
            for await (const [_, channel] of channelToEdit) {
                if (channel.isText()) {
                    await channel.permissionOverwrites?.edit(member.id, {
                        SEND_MESSAGES: null
                    }, {
                        reason: `Setup by ${message.author.username}#${message.author.discriminator}`,
                        type: 0
                    })
                    await channel.permissionOverwrites?.edit(message.guild.roles.everyone.id, {
                        SEND_MESSAGES: null
                    }, {
                        reason: `Setup by ${message.author.username}#${message.author.discriminator}`,
                        type: 0
                    })
                    await channel.permissionOverwrites?.edit(mute.id, {
                        SEND_MESSAGES: false
                    }, {
                        reason: `Setup by ${message.author.username}#${message.author.discriminator}`,
                        type: 0
                    })
                }
                if (channel.isVoice()) {
                    await channel.permissionOverwrites?.edit(member.id, {
                        SPEAK: null
                    }, {
                        reason: `Setup by ${message.author.username}#${message.author.discriminator}`,
                        type: 0
                    })
                    await channel.permissionOverwrites?.edit(message.guild.roles.everyone.id, {
                        SPEAK: null
                    }, {
                        reason: `Setup by ${message.author.username}#${message.author.discriminator}`,
                        type: 0
                    })
                    await channel.permissionOverwrites?.edit(mute.id, {
                        SPEAK: false
                    }, {
                        reason: `Setup by ${message.author.username}#${message.author.discriminator}`,
                        type: 0
                    })
                }
            }
        return message.channel.send({ content: 'oneforall is setup correctly with channels permissions' })
    }
}

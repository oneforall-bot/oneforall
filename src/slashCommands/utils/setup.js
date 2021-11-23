const {Permissions} = require("discord.js");
module.exports = {
    data: {
        name: 'setup',
        description: 'Setup the mute and member roles',
        options: [
            {
                type: 'ROLE',
                name: 'member',
                description: 'The member role (everyone if no member role)',
                required: true
            },
            {
                type: 'ROLE',
                name: 'mute',
                description: 'The mute role',
                required: true
            },
            {
                type: 'BOOLEAN',
                description: 'To automatically setup the mute role in channels or not',
                name: 'setup',
                required: true
            }
        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {

        const isOwner = oneforall.config.owners.includes(interaction.user.id)
        await interaction.deferReply({ephemeral: (!!!isOwner)});
        const lang = guildData.langManager;
        if(!isOwner) return interaction.editReply({content: lang.notOwner('/', {name: 'setup'})})
        const { options } = interaction;
        const member = options.getRole('member')
        const mute = options.getRole('mute')
        if(mute.id === interaction.guild.roles.everyone.id) return interaction.editReply({content: lang.setup.muteRoleEveryone})
        const needToSetup = options.getBoolean('setup')
        guildData.member = member.id;
        guildData.mute = mute.id;
        guildData.setup = true
        guildData.save()
        if(!needToSetup) return interaction.editReply({content: 'oneforall is setup correctly'})
        const channelToEdit = interaction.guild.channels.cache.filter(channel => (channel.isVoice() || channel.isText()) && (channel.permissionsFor(member.id).has(channel.isText() ? [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL] : channel.isVoice() ? [Permissions.FLAGS.CONNECT] : [])))
        if(channelToEdit.size > 0)
          for await (const [_, channel] of channelToEdit){
            if(channel.isText()) {
                await channel.permissionOverwrites?.edit(member.id, {
                    SEND_MESSAGES: null
                }, {
                    reason: `Setup by ${interaction.user.username}#${interaction.user.discriminator}`,
                    type: 0
                })
                await channel.permissionOverwrites?.edit(interaction.guild.roles.everyone.id, {
                    SEND_MESSAGES: null
                }, {
                    reason: `Setup by ${interaction.user.username}#${interaction.user.discriminator}`,
                    type: 0
                })
                await channel.permissionOverwrites?.edit(mute.id, {
                    SEND_MESSAGES: false
                }, {
                    reason: `Setup by ${interaction.user.username}#${interaction.user.discriminator}`,
                    type: 0
                })
            }
            if(channel.isVoice()){
                await channel.permissionOverwrites?.edit(member.id, {
                    SPEAK: null
                }, {
                    reason: `Setup by ${interaction.user.username}#${interaction.user.discriminator}`,
                    type: 0
                })
                await channel.permissionOverwrites?.edit(interaction.guild.roles.everyone.id, {
                    SPEAK: null
                }, {
                    reason: `Setup by ${interaction.user.username}#${interaction.user.discriminator}`,
                    type: 0
                })
                await channel.permissionOverwrites?.edit(mute.id, {
                    SPEAK: false
                }, {
                    reason: `Setup by ${interaction.user.username}#${interaction.user.discriminator}`,
                    type: 0
                })
            }
        }
        return interaction.editReply({content: 'oneforall is setup correctly with channels permissions'})
    }
}

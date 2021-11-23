module.exports = {
    data: {
        name: 'massrole',
        description: 'Add or remove a role to all the server',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'add',
                description: 'Add a role to all the server',
                options: [
                    {
                        type: 'ROLE',
                        name: 'role',
                        description: 'The role to add',
                        required: true
                    },
                    {
                        type: 'BOOLEAN',
                        name: 'humans',
                        description: 'Give the role to humans ?',
                        required: true,
                    },
                    {
                        type: 'BOOLEAN',
                        name: 'bot',
                        description: 'Give the role to bots ?',
                        required: true,
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'remove',
                description: 'Remove a role to all the server',
                options: [
                    {
                        type: 'ROLE',
                        name: 'role',
                        description: 'The role to remove',
                        required: true
                    },
                    {
                        type: 'BOOLEAN',
                        name: 'humans',
                        description: 'Remove the role to humans ?',
                        required: true,
                    },
                    {
                        type: 'BOOLEAN',
                        name: 'bot',
                        description: 'Remove the role to bots ?',
                        required: true,
                    }
                ]
            }

        ]
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const subCommand = interaction.options.getSubcommand()
        const {options} = interaction
        const lang = guildData.langManager
        const hasPermission = memberData.permissionManager.has(`MASSROLE_${subCommand.toUpperCase()}_CMD`);
        const role = options.getRole('role')
        const humans = options.getBoolean('humans')
        const bot = options.getBoolean('bot')
        const roleHasSensiblePermissions = oneforall.functions.roleHasSensiblePermissions(role.permissions)
        await interaction.deferReply({ephemeral: (!!!hasPermission || roleHasSensiblePermissions || role.managed)});
        const oneforallHighestRole = interaction.guild.me.roles.highest.position
        if (!hasPermission || roleHasSensiblePermissions || role.managed || oneforallHighestRole < role.position) {
            return interaction.editReply({
                content: !hasPermission ? lang.notEnoughPermissions(`massrole ${subCommand}`) : role.managed ? lang.roleManaged : oneforallHighestRole < role.position ? lang.roleSuppThanClient : lang.roleHasSensiblePermissions
            });

        }
        const members = await interaction.guild.members.fetch()
        if(role.managed) return interaction.editReply({content: lang.roleManaged})
        const membersToEdit = members.filter(member =>  (subCommand === 'add' ? !member.roles.cache.has(role.id) : member.roles.cache.has(role.id)) && (bot && !humans ? member.user.bot : !bot && humans ? !member.user.bot : true))
        if(membersToEdit.size < 1) return interaction.editReply({content: lang.massrole.notMembersToEdit})
        for await(const [id, member] of membersToEdit)
            member.roles[subCommand](role, `Massrole ${subCommand} by ${interaction.user.username}#${interaction.user.discriminator}`)
        await interaction.editReply({content: lang.massrole.success(role.name, membersToEdit.size, subCommand)})
    }
}

module.exports = async (oneforall, interaction) => {
    const handlers = oneforall.handlers;
    const slash = (interaction.isCommand() ? handlers.slashCommandHandler.slashCommandList : (interaction.isContextMenu() ? handlers.contextMenuHandler.contextMenuList : null))?.get(interaction.commandName.toLowerCase());

    if (slash && interaction.inGuild()) {
        const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(`${interaction.member.guild.id}`, {
            guildId: interaction.member.guild.id
        });

        if (!guildData) return;

        const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${interaction.member.guild.id}-${interaction.member.id}`, {
            guildId: interaction.member.guild.id,
            memberId: interaction.member.id
        });


        if (!memberData) return;
        guildData.langManager = oneforall.handlers.langHandler.get(guildData.lang);
        memberData.permissionManager = new oneforall.Permission(oneforall, interaction.member.guild.id, interaction.member.id, memberData, guildData);

        const target = interaction.isContextMenu() ? (interaction.targetType === "USER" ? interaction.targetId : (interaction.targetType === "MESSAGE" ? (await interaction.channel.messages.fetch(interaction.targetId) || null) : null)) : null;

        slash.run(oneforall, interaction, memberData, guildData, target);
        console.log(`Slash command: ${slash.data.name} has been executed by ${interaction.user.username}#${interaction.user.discriminator} in ${interaction.guild.name}`);
    }
}

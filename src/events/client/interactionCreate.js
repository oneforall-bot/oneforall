const {on} = require("cluster");
module.exports = async (oneforall, interaction) => {
    const handlers = oneforall.handlers;
    const slash = (interaction.isCommand() ? handlers.slashCommandHandler.slashCommandList : (interaction.isContextMenu() ? handlers.contextMenuHandler.contextMenuList : null))?.get(interaction.commandName.toLowerCase());

    if (slash && interaction.inGuild()) {
        const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(`${interaction.guildId}`, {
            guildId: interaction.guildId
        });

        if (!guildData) return;

        const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${interaction.guildId}-${interaction.member.id}`, {
            guildId: interaction.guildId,
            memberId: interaction.member.id
        });


        if (!memberData) return;
        if(!oneforall.isOwner(interaction.user.id)) {
            if (slash.guildOwnersOnly && !oneforall.isGuildOwner(interaction.user.id, guildData.owners) && interaction.guild.ownerId !== interaction.user.id) {
                return interaction.reply(oneforall.langManager().get(guildData.lang).notGuildOwner("/", slash.data))
            }
            if (slash.ownersOnly && !oneforall.config.owners.includes(interaction.user.id))
                return interaction.reply({content: oneforall.langManager().get(guildData.lang).notOwner("/", slash.data)});

            if (slash.guildCrownOnly && interaction.guild.ownerId !== interaction.user.id) {
                return interaction.reply(oneforall.langManager().get(guildData.lang).notGuildOwner("/", slash.data))
            }
        }
        guildData.langManager = oneforall.handlers.langHandler.get(guildData.lang);
        memberData.permissionManager = new oneforall.Permission(oneforall, interaction.member.guild.id, interaction.member.id, memberData, guildData);

        const target = interaction.isContextMenu() ? (interaction.targetType === "USER" ? interaction.targetId : (interaction.targetType === "MESSAGE" ? (await interaction.channel.messages.fetch(interaction.targetId) || null) : null)) : null;

        slash.run(oneforall, interaction, memberData, guildData, target);
        console.log(`Slash command: ${slash.data.name} has been executed by ${interaction.user.username}#${interaction.user.discriminator} in ${interaction.guild.name}`);
    }
}

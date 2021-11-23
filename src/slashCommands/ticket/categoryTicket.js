module.exports = {
    data: {
        name: `categoryticket`,
        description: `Allows you to edit category Ticket`
    },
    run: async (oneforall, interaction, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("CATEGORY_TICKET_CMD");
        await interaction.deferReply({ephemeral: true});

        if (!hasPermission)
            return interaction.editReply({
                content: "You do not have permission."
            });

    }
}

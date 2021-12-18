module.exports = {
    data: {
        name: `categoryticket`,
        description: `Allows you to edit category Ticket`
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("CATEGORY_TICKET_CMD");
        await message.deferReply({ephemeral: true});

        if (!hasPermission)
            return message.editReply({
                content: "You do not have permission."
            });

    }
}

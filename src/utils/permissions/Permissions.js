class Permissions {
    constructor(oneforall, guildData) {
        const langManager = oneforall.handlers.langHandler.get(guildData.lang);

        this.permissions = {
            ALL: {
                emoji: "🟢",
                label: langManager.permissions["ALL"].label,
                description: langManager.permissions["ALL"].description
            },
            GROUP_NEW_CMD: {
                emoji: "🔨",
                label: langManager.permissions["GROUP_NEW_CMD"].label,
                description: langManager.permissions["GROUP_NEW_CMD"].description
            },
            BLACKLIST_CMD: {
                emoji: ``,
                label: langManager.permissions["BLACKLIST_CMD"].label,
                description: langManager.permissions["BLACKLIST_CMD"].description
            },
            REACTROLE_CMD: {
                emoji: ``,
                label: langManager.permissions["REACTROLE_CMD"].label,
                description: langManager.permissions["REACTROLE_CMD"].description
            },
            EMBED_CMD: {
                emoji: ``,
                label: langManager.permissions["EMBED_CMD"].label,
                description: langManager.permissions["EMBED_CMD"].description,
            },
            SOUTIEN_CONFIG_CMD: {
                emoji: ``,
                label: langManager.permissions["SOUTIEN_CONFIG_CMD"].label,
                description: langManager.permissions["SOUTIEN_CONFIG_CMD"].description,
            },
            SOUTIEN_COUNT_CMD: {
                emoji: ``,
                label: langManager.permissions["SOUTIEN_COUNT_CMD"].label,
                description: langManager.permissions["SOUTIEN_COUNT_CMD"].description,
            },
            RENEW_CMD: {
                emoji: ``,
                label: langManager.permissions["RENEW_CMD"].label,
                description: langManager.permissions["RENEW_CMD"].description,
            },
            BAN_CMD: {
                emoji: ``,
                label: langManager.permissions["BAN_CMD"].label,
                description: langManager.permissions["BAN_CMD"].description,
            },
            UNBAN_CMD: {
                emoji: ``,
                label: langManager.permissions["UNBAN_CMD"].label,
                description: langManager.permissions["UNBAN_CMD"].description,
            },
            KICK_CMD: {
                emoji: ``,
                label: langManager.permissions["KICK_CMD"].label,
                description: langManager.permissions["KICK_CMD"].description,
            },
            ADD_PERMISSIONS_CMD: {
                emoji: ``,
                label: langManager.permissions["ADD_PERMISSIONS_CMD"].label,
                description: langManager.permissions["ADD_PERMISSIONS_CMD"].description,
            },
            REMOVE_PERMISSIONS_CMD: {
                emoji: ``,
                label: langManager.permissions["REMOVE_PERMISSIONS_CMD"].label,
                description: langManager.permissions["REMOVE_PERMISSIONS_CMD"].description,
            },
            ADD_GROUPS_CMD: {
                emoji: ``,
                label: langManager.permissions["ADD_GROUPS_CMD"].label,
                description: langManager.permissions["ADD_GROUPS_CMD"].description,
            },
            REMOVE_GROUPS_CMD: {
                emoji: ``,
                label: langManager.permissions["REMOVE_GROUPS_CMD"].label,
                description: langManager.permissions["REMOVE_GROUPS_CMD"].description,
            },
            ADD_EMOJI_CMD: {
                emoji: ``,
                label: langManager.permissions["ADD_EMOJI_CMD"].label,
                description: langManager.permissions["ADD_EMOJI_CMD"].description,
            },
            REMOVE_EMOJI_CMD: {
                emoji: ``,
                label: langManager.permissions["REMOVE_EMOJI_CMD"].label,
                description: langManager.permissions["REMOVE_EMOJI_CMD"].description,
            },
            CATEGORY_TICKET_CMD: {
                emoji: ``,
                label: langManager.permissions["CATEGORY_TICKET_CMD"].label,
                description: langManager.permissions["CATEGORY_TICKET_CMD"].description,
            },
            ANTIRAID_CMD: {
                emoji: ``,
                label: langManager.permissions["ANTIRAID_CMD"].label,
                description: langManager.permissions["ANTIRAID_CMD"].description,
            },
            SETLOGS_CMD: {
                emoji: ``,
                label: langManager.permissions["SETLOGS_CMD"].label,
                description: langManager.permissions["SETLOGS_CMD"].description,
            },
            INVITE_CONFIG_CMD: {
                emoji: ``,
                label: langManager.permissions["INVITE_CONFIG_CMD"].label,
                description: langManager.permissions["INVITE_CONFIG_CMD"].description,
            },
            INVITE_ADD_CMD: {
                emoji: ``,
                label: langManager.permissions["INVITE_ADD_CMD"].label,
                description: langManager.permissions["INVITE_ADD_CMD"].description,
            },
            INVITE_REMOVE_CMD: {
                emoji: ``,
                label: langManager.permissions["INVITE_REMOVE_CMD"].label,
                description: langManager.permissions["INVITE_REMOVE_CMD"].description,
            },
            INVITE_RESET_CMD: {
                emoji: ``,
                label: langManager.permissions["INVITE_RESET_CMD"].label,
                description: langManager.permissions["INVITE_RESET_CMD"].description,
            },
            GIVEAWAY_CMD: {
                emoji: ``,
                label: langManager.permissions["GIVEAWAY_CMD"].label,
                description: langManager.permissions["GIVEAWAY_CMD"].description,
            },
            MASSROLE_ADD_CMD: {
                emoji: ``,
                label: langManager.permissions["MASSROLE_ADD_CMD"].label,
                description: langManager.permissions["MASSROLE_ADD_CMD"].description,
            },
            MASSROLE_REMOVE_CMD: {
                emoji: ``,
                label: langManager.permissions["MASSROLE_REMOVE_CMD"].label,
                description: langManager.permissions["MASSROLE_REMOVE_CMD"].description,
            },
            MUTE_CMD: {
                emoji: ``,
                label: langManager.permissions["MUTE_CMD"].label,
                description: langManager.permissions["MUTE_CMD"].description,
            },
            TEMP_MUTE_CMD: {
                emoji: ``,
                label: langManager.permissions["TEMP_MUTE_CMD"].label,
                description: langManager.permissions["TEMP_MUTE_CMD"].description,
            },
            UNMUTE_CMD: {
                emoji: ``,
                label: langManager.permissions["UNMUTE_CMD"].label,
                description: langManager.permissions["UNMUTE_CMD"].description,
            },
            CLEAR_CMD: {
                emoji: ``,
                label: langManager.permissions["CLEAR_CMD"].label,
                description: langManager.permissions["CLEAR_CMD"].description,
            },
            BRING_CMD: {
                emoji: ``,
                label: langManager.permissions["BRING_CMD"].label,
                description: langManager.permissions["BRING_CMD"].description,
            },
            AUTOROLE_CMD: {
                emoji: ``,
                label: langManager.permissions["AUTOROLE_CMD"].label,
                description: langManager.permissions["AUTOROLE_CMD"].description,
            },
            BACKUP_CMD: {
                emoji: ``,
                label: langManager.permissions["BACKUP_CMD"].label,
                description: langManager.permissions["BACKUP_CMD"].description,
            },
            COUNTER_CMD: {
                emoji: ``,
                label: langManager.permissions["COUNTER_CMD"].label,
                description: langManager.permissions["COUNTER_CMD"].description,
            },
            LOCK_CMD: {
                emoji: ``,
                label: langManager.permissions["LOCK_CMD"].label,
                description: langManager.permissions["LOCK_CMD"].description,
            },
            TEMPVOC_CMD: {
                emoji: ``,
                label: langManager.permissions["TEMPVOC_CMD"].label,
                description: langManager.permissions["TEMPVOC_CMD"].description,
            },
            ALL_CMD: {
                emoji: ``,
                label: langManager.permissions["ALL_CMD"].label,
                description: langManager.permissions["ALL_CMD"].description,
            },
            UNRANK_CMD: {
                emoji: ``,
                label: langManager.permissions["UNRANK_CMD"].label,
                description: langManager.permissions["UNRANK_CMD"].description,
            },
            PICONLY_CMD: {
                emoji: ``,
                label: langManager.permissions["PICONLY_CMD"].label,
                description: langManager.permissions["PICONLY_CMD"].description,
            }
        }

        Object.keys(guildData.antiraid.enable).forEach(eventName => {
            this.permissions[`EVENT_ANTIRAID_${eventName.toUpperCase()}`] = {
                emoji: ``,
                label: langManager.permissions["EVENT_ANTIRAID"](eventName).label,
                description: langManager.permissions["EVENT_ANTIRAID"](eventName).description,
            }
        })
        oneforall.managers.categoryTicketManager.filter(k => k.guildId === guildData.guildId).forEach(c => {
            this.permissions[`CAT_TICKET_${c.categoryName.replace(/ /g, "_").toUpperCase()}`] = {
                emoji: ``,
                label: langManager.permissions["CAT_TICKET"](c.categoryName).label,
                description: langManager.permissions["CAT_TICKET"](c.categoryName).description,
            }
        });

    }

    count() {
        return Object.keys(this.permissions).length;
    }

}

module.exports = Permissions;

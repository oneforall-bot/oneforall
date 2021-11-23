class GroupPermission {
    constructor(oneforall, guildId, groupName) {
        this.oneforall = oneforall;

        this.groupData = oneforall.managers.groupsManager.getIfExist(`${guildId}-${groupName}`, {
            guildId,
            groupName
        });
        if (!this.groupData)
            throw new Error(`${groupName} group not found`);
    }

    has(permission) {
        return this.groupData.permissions.includes(permission);
    }

    add(...permissions) {
        this.groupData.permissions.push(...permissions.filter(p => !this.groupData.permissions.includes(p)));
        this.groupData.save();
        return this;
    }

    remove(...permissions) {
        this.groupData.permissions = this.groupData.permissions.filter(permission => !permissions.includes(permission));
        this.groupData.save();
        return this;
    }

    list() {
        return this.groupData.permissions.filter(p => !this.oneforall.commandHandler.permissions.includes(p));
    }

    clear() {
        this.groupData.permissions.clear();
        this.groupData.save();
        return this;
    }
}

module.exports = GroupPermission;

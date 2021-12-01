class MemberPermissions {
    constructor(oneforall, guildId, roleId) {
        this.oneforall = oneforall;

        this.roleData = oneforall.managers.rolesManager.getAndCreateIfNotExists(`${roleId}`, {
            roleId
        });
    }

    has(permission) {
        return this.roleData.permissions.includes(permission);
    }

    add(...permissions) {
        this.roleData.permissions.push(...permissions.filter(p => !this.memberData.permissions.includes(p)));
        this.roleData.save();
        return this;
    }

    remove(...permissions) {
        this.roleData.permissions = this.roleData.permissions.filter(permission => !permissions.includes(permission));
        this.roleData.save();
        return this;
    }

    clear() {
        this.roleData.permissions.clear();
        this.roleData.save();
        return this;
    }
}

module.exports = MemberPermissions;

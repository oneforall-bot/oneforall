class MemberPermissions {
    constructor(oneforall, guildId, memberId) {
        this.oneforall = oneforall;

        this.memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${guildId}-${memberId}`, {
            guildId,
            memberId
        });
    }

    has(permission) {
        return this.memberData.permissions.includes(permission);
    }

    add(...permissions) {
        this.memberData.permissions.push(...permissions.filter(p => !this.memberData.permissions.includes(p)));
        this.memberData.save();
        return this;
    }

    remove(...permissions) {
        this.memberData.permissions = this.memberData.permissions.filter(permission => !permissions.includes(permission));
        this.memberData.save();
        return this;
    }

    clear() {
        this.memberData.permissions.clear();
        this.memberData.save();
        return this;
    }
}

module.exports = MemberPermissions;

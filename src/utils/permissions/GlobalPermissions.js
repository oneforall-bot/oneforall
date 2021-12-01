const MemberPermissions = require('./MemberPermissions');
const GroupPermissions = require('./GroupPermissions');
const Permissions = require('./Permissions');

class GlobalPermission {
    constructor(oneforall, guildId, memberId, memberData, guildData, roleData) {
        this.oneforall = oneforall;
        this.guildId = guildId;
        this.memberId = memberId;

        this.memberData = memberData
        this.roleData = roleData
        this.guildData = guildData;
        this.enumPermissions = new Permissions(this.oneforall, guildData);
    }

    has(permission) {
        return this.list().includes('ALL') || this.oneforall.guilds.cache.get(this.guildId)?.ownerId === this.memberId || this.oneforall.config.owners.includes(this.memberId) || this.list().includes(permission);

    }

    getGroupsPermissionManager() {
        const groupsPermissionManager = new this.oneforall.Collection();
        this.memberData.groups.forEach(g => {
            groupsPermissionManager.set(g, new GroupPermissions(this.oneforall, this.guildId, g));
        })
        return groupsPermissionManager;
    }

    getMemberPermissionManager() {
        return new MemberPermissions(this.oneforall, this.guildId, this.memberId);
    }

    list() {
        const permissions = [];
        permissions.push(...this.memberData.permissions.filter(p => !permissions.includes(p)));
        // const memberRolesHas = guildRoles.filter(async role => (await this.oneforall.guilds.cache.get(this.guildId).members.fetch(this.memberId).catch(() => {}))?.roles.cache.has(role.roleId))
        // console.log(memberRolesHas)
        this.oneforall.managers.rolesManager.forEach(async roleManager => {
            const member = this.oneforall.guilds.cache.get(this.guildId).members.cache.get(this.memberId)
            if (member?.roles.cache.has(roleManager.roleId)) {
                roleManager.groups.forEach(g => {
                    const group = this.oneforall.managers.groupsManager.getIfExist(`${this.guildId}-${g}`);
                    if (!group)
                        this.memberData.groups = this.memberData.groups.filter(g_ => g_ !== g);
                    else
                        permissions.push(...group.permissions.filter(p => !permissions.includes(p)));
                })
                permissions.push(...roleManager.permissions.filter(p => !permissions.includes(p)))
            }
        })

        this.memberData.groups.forEach(g => {
            const group = this.oneforall.managers.groupsManager.getIfExist(`${this.guildId}-${g}`);
            if (!group)
                this.memberData.groups = this.memberData.groups.filter(g_ => g_ !== g);
            else
                permissions.push(...group.permissions.filter(p => !permissions.includes(p)));
        });

        return permissions;
    }
}

module.exports = GlobalPermission;

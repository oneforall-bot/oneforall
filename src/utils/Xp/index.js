class XpSystem {
    constructor(oneforall) {
        this.oneforall = oneforall;
        this.membersManager = this.oneforall.managers.membersManager
    }

    getOrCreate(memberId, guildId) {
        return this.membersManager.getAndCreateIfNotExists(`${guildId}-${memberId}`, {
            guildId,
            memberId
        })
    }

    appendXp(memberId, guildId, xp) {
        if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");
        const memberData = this.getOrCreate(memberId, guildId)
        memberData.xp.xp += parseInt(xp, 10)
        const memberXp = memberData.xp
        memberXp.level = Math.floor(0.1 * Math.sqrt(memberData.xp.xp))
        memberXp.lastUpdated = new Date()
        memberData.xp = memberXp
        memberData.save()
        return (Math.floor(0.1 * Math.sqrt(memberXp.xp - xp)) < memberXp.level)
    }

    appendLevel(memberId, guildId, levels) {
        const memberData = this.getOrCreate(memberId, guildId)
        const memberXp = memberData.xp
        memberXp.level += parseInt(levels, 10)
        memberXp.lastUpdated = new Date()
        memberData.xp = memberXp
        memberData.save()
        return memberData
    }

    setXp(memberId, guildId, xp) {
        if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");
        const memberData = this.getOrCreate(memberId, guildId)
        const memberXp = memberData.xp
        memberXp.xp = xp
        memberXp.level = Math.floor(0.1 * Math.sqrt(memberData.xp))
        memberXp.lastUpdated = new Date()
        memberData.save()
        return memberData
    }

    setLevel(memberId, guildId, level) {
        if (!level) throw new TypeError("A level was not provided.");
        const memberData = this.getOrCreate(memberId, guildId)
        const memberXp = memberData.xp
        memberXp.level = level
        memberXp.xp = level * level * 1000
        memberXp.lastUpdated = new Date()
        memberData.save()
        return memberData
    }

    async fetch(memberId, guildId, fetchPosition = false) {
        if (!memberId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const memberData = await this.getOrCreate(memberId, guildId)
        const memberXp = memberData.xp
        if (fetchPosition === true) {
            const members = this.membersManager.filter(member => member.guildId === guildId).sort((a, b) => b.xp.xp - a.xp.xp)
            const leaderboard = members.map(member => {
                return {
                    memberId: member.memberId,
                    guildId: member.guildId,
                    ...member.xp
                }
            })

            memberXp.position = leaderboard.findIndex(i => i.memberId === memberId) + 1;

        }


        /* To be used with canvacord or displaying xp in a pretier fashion, with each level the cleanXp stats from 0 and goes until cleanNextLevelXp when user levels up and gets back to 0 then the cleanNextLevelXp is re-calculated */
        memberXp.cleanXp = memberXp.xp - this.xpFor(memberXp.level);
        memberXp.cleanNextLevelXp = this.xpFor(memberXp.level + 1) - this.xpFor(memberXp.level);
        memberData.xp = memberXp
        memberData.save()
        return memberXp;
    }

    subtractXp(memberId, guildId, xp) {
        if (!memberId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const memberData = this.getOrCreate(memberId, guildId)
        const memberXp = memberData.xp
        memberXp.xp -= xp
        memberXp.level = Math.floor(0.1 * Math.sqrt(memberXp.xp));
        memberXp.lastUpdated = new Date();
        memberData.xp = memberXp
        memberData.save()
        return memberData;
    }

    subtractLevel(memberId, guildId, level) {
        if (!memberId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!level) throw new TypeError("An amount of levels was not provided.");


        const memberData = this.getOrCreate(memberId, guildId)
        const memberXp = memberData.xp
        memberXp.level -= level
        memberXp.xp = level * level * 1000
        memberXp.lastUpdated = new Date();
        memberData.xp = memberXp
        memberData.save()
        return memberData;
    }

    fetchLeaderboard(guildId, limit) {
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!limit) throw new TypeError("A limit was not provided.");
        const members = this.membersManager.filter(member => member.guildId === guildId).sort((a, b) => b.xp.xp - a.xp.xp)
        const leaderboard = members.map(member => {
            return {
                memberId: member.memberId,
                guildId: member.guildId,
                ...member.xp
            }
        })
        return leaderboard.slice(0, limit);
    }

    async computeLeaderboard(leaderboard, fetchUsers = false) {
        if (leaderboard.length < 1) return [];

        const computedArray = [];

        if (fetchUsers) {
            for (const key of leaderboard) {
                const user = await this.oneforall.users.fetch(key.userId) || {username: "Unknown", discriminator: "0000"};
                computedArray.push({
                    guildID: key.guildId,
                    userId: key.userId,
                    xp: key.xp,
                    level: key.level,
                    position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
                    username: user.username,
                    discriminator: user.discriminator
                });
            }
        } else {
            leaderboard.map(key => computedArray.push({
                guildID: key.guildId,
                userId: key.userId,
                xp: key.xp,
                level: key.level,
                position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
                username: this.oneforall.users.cache.get(key.userId) ? this.oneforall.users.cache.get(key.userId).username : "Unknown",
                discriminator: this.oneforall.users.cache.get(key.userId) ? this.oneforall.users.cache.get(key.userId).discriminator : "0000"
            }));
        }

        return computedArray;
    }
    xpFor(targetLevel) {
        if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10))) throw new TypeError("Target level should be a valid number.");
        if (isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10);
        if (targetLevel < 0) throw new RangeError("Target level should be a positive number.");
        return targetLevel * targetLevel * 100;
    }
}

module.exports = XpSystem

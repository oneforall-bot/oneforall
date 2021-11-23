module.exports = function (database, modelName) {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "id",
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            {
                name: "guildId",
                type: DataTypes.TEXT,
                allowNull: false,
                isWhere: true
            },
            {
                name: "memberId",
                type: DataTypes.TEXT,
                allowNull: false,
                isWhere: true
            },

            {
                name: "groups",
                type: DataTypes.JSON,
                allowNull: false,

                isValue: true,
                default: []
            },
            {
                name: "permissions",
                type: DataTypes.JSON,
                allowNull: false,

                isValue: true,
                default: []
            },
            {
                name: "antiraidLimits",
                type: DataTypes.JSON,
                allowNull: false,
                isValue: true,
                default: {
                    antiLink: {count: 0},
                    mentions: {count: 0},
                    ban: {count: 0, banned: []},
                    kick: {count: 0}
                }
            },
            {
                name: 'invites',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {
                    join: 0, leave: 0, fake: 0, bonus: 0, get total(){
                        const x =  this.join - this.leave - this.bonus
                        return x < 0 ? 0 : x
                    }
                }
            }
        ];

        const t = {};
        data.forEach(y => {
            t[y.name] = y;
        })


        try {
            database.define(modelName, t, {
                timestamps: false,
                tableName: modelName,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }).sync().then(() => {
                resolve(data);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }

    })
}

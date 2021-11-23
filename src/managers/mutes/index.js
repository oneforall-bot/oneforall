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
                name: "expiredAt",
                type: DataTypes.DATE,
                allowNull: true,
                isValue: true,
            },
            {
                name: "createdAt",
                type: DataTypes.DATE,
                allowNull: true,
                isValue: true,
            },
            {
                name: "reason",
                type: DataTypes.TEXT,
                allowNull: true,
                isValue: true,
            },
            {
                name: "authorId",
                type: DataTypes.TEXT,
                allowNull: true,
                isValue: true,
            },
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

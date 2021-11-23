module.exports = function (database, modelName, config) {
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
                type: DataTypes.STRING(25),
                allowNull: false,
                isWhere: true
            },
            {
                name: "userId",
                type: DataTypes.STRING(25),
                allowNull: false,
                isWhere: true
            },
            {
                name: `authorId`,
                type: DataTypes.STRING(25),
                allowNull: false,
                isValue: true
            },
            {
                name: `reason`,
                type: DataTypes.TEXT,
                allowNull: false,
                isValue: true,
                default: `No reason specified`
            }
        ]
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
            }).sync({alter: true}).then(() => {
                resolve(data);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }

    })
}

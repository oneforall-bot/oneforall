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
                name: "messageId",
                type: DataTypes.TEXT,
                allowNull: false,

                isWhere: true
            },
            {
                name: "data",
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
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
            }).sync().then(() => {
                resolve(data);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }

    })
}

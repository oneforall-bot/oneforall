module.exports = function (database, modelName) {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "roleId",
                type: DataTypes.TEXT,
                allowNull: false,
                isWhere: true,
                primaryKey: true
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
            }).sync({alter: true}).then(() => {
                resolve(data);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }

    })
}

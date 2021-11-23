const {Sequelize, DataTypes} = require('sequelize');

class OFADatabase extends Sequelize {
    constructor(oneforall) {
        super(oneforall.config.database.name,oneforall.config.database.username, oneforall.config.database.password,{
            dialect: 'mysql',
            logging: false,
            define: {
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
                timestamps: false,
                freezeTableName: true,
            },
        });
        this.DataTypes = DataTypes;
    }

    authenticate(options) {
        return new Promise((resolve, reject) => {
            try {
                super.authenticate(options).then(resolve).catch(reject);
            }catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = OFADatabase;

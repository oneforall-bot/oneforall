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
                type: DataTypes.TEXT,
                allowNull: false,

                isWhere: true
            },
            {
                name: "lang",
                type: DataTypes.STRING(2),
                allowNull: false,

                isValue: true,
                default: "fr"
            },
            {
                name: 'reactroles',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: []
            },
            {
                name: 'soutien',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {role: null, message: null, enable: false}
            },
            {
                name: 'antiraid',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {
                    enable: {
                        webhookUpdate: false,
                        roleCreate: false,
                        roleUpdate: false,
                        roleDelete: false,
                        channelCreate: false,
                        channelUpdate: false,
                        channelDelete: false,
                        antiSpam: false,
                        antiMassBan: false,
                        antiBot: false,
                        roleAdd: false,
                        antiLink: false,
                        antiMassKick: false,
                        antiDc: false,
                        nameUpdate: false,
                        vanityUpdate: false,
                        antiToken: false,
                        antiMassMention: false,
                    },
                    config: {
                        webhookUpdate: 'unrank',
                        roleCreate: 'unrank',
                        roleUpdate: 'unrank',
                        roleDelete: 'unrank',
                        channelCreate: 'unrank',
                        channelUpdate: 'unrank',
                        channelDelete: 'unrank',
                        antiSpam: 'unrank',
                        antiMassBan: 'unrank',
                        antiBot: 'unrank',
                        roleAdd: 'unrank',
                        antiLink: 'unrank',
                        antiMassKick: 'unrank',
                        antiDc: 'kick',
                        nameUpdate: 'unrank',
                        vanityUpdate: 'unrank',
                        antiToken: 'kick',
                        antiMassMention: 'kick',
                    },
                    limit: {
                        antiMassBan: '3/10s',
                        antiMassKick: '2/10s',
                        antiDc: '1d',
                        antiLink: '2/10s',
                        antiToken: '10/1Os',
                        antiMassMention: '10/10s',

                    },
                    activeLimits: {
                        antiToken: {recentJoined: [], counter: 0}
                    },

                },

            },
            {
                name: 'logs',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {message: null, voice: null, antiraid: null, moderation: null}
            },
            {
                name: 'invites',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {channel: null, message: null, enable: false}
            },
            {
                name: 'member',
                type: DataTypes.STRING(25),
                allowNull: true,
                isValue: true,
            },
            {
                name: 'mute',
                type: DataTypes.STRING(25),
                allowNull: true,
                isValue: true,
            },
            {
                name: 'setup',
                type: DataTypes.BOOLEAN,
                allowNull: true,
                isValue: true,
            },
            {
                name: 'autoroles',
                isValue: true,
                type: DataTypes.JSON,
                allowNull: true,
                default: []
            },
            {
                name: 'guildOwners',
                isValue: true,
                type: DataTypes.JSON
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

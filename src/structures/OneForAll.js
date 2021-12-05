const {Client, Intents} = require('discord.js');
const {Collection} = require('../utils/collection');
const OFADatabase = require('./OFADatabase');
const OFAManagers = require('./OFAManagers');
const OFAHandlers = require("./OFAHandlers");
const Permission = require('../utils/permissions/GlobalPermissions');
const logs = require('discord-logs')
const XpSystem = require('../utils/Xp')
module.exports = class extends Client {
    constructor() {
        super({
            partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
            intents: Object.keys(Intents.FLAGS),
        });
        this.Collection = Collection;
        this.functions = require('../utils/functions');
        this.config = require('../config');
        this.login(this.config.token).catch((e) => {
            console.log(e)
        });
        this.database = new OFADatabase(this);
        this._fs = require('fs');
        this._fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


        this.DataMenu = require('../utils/DataMenu')
        this.Permission = Permission;

        this.database.authenticate().then(async () => {
            this.managers = new OFAManagers(this);
            this.xpManager = new XpSystem(this)

        });

        this.cachedInv = new Collection()
        this.snipes = new this.Collection()
        this.slashReloaded = new Set()
        this.antiraidCmdLoaded = false
        logs(this)
    }

    startEventHandler() {
        this.handlers = new OFAHandlers(this);
        if (this.isReady()) {
            setTimeout(() => this.emit('ready'), 100);

        }
    }

    embed(guildData) {
        return {
            color: guildData?.embedColor || "#36393E",
            timestamp: new Date()
        }
    }

    isOwner(authorId) {
        return !!this.config.owners.includes(authorId)
    }

    isGuildOwner(authorId, guildOwners) {
        return !!(this.isOwner(authorId) && guildOwners.includes(authorId))
    }

    langManager() {
        return this.handlers.langHandler
    }

    async setCommands(guildId, guildData){
        if (!this.slashReloaded.has(guildId)) {
            if (!this.application?.owner) await this.application?.fetch();
            this.slashReloaded.add(guildId);
            if (!this.antiraidCmdLoaded) {
                const antiraidCmd = this.handlers.slashCommandHandler.slashCommandList.get('antiraid')
                for (const options of Object.keys(guildData.antiraid.config)) {
                    antiraidCmd.data.options[0].options[0].choices.push({
                        name: options,
                        value: options
                    })
                }
                for (const options of Object.keys(guildData.antiraid.enable)) antiraidCmd.data.options[1].options[0].choices.push({
                    name: options,
                    value: options
                })
                for (const options of Object.keys(guildData.antiraid.limit)) {
                    antiraidCmd.data.options[2].options[0].choices.push({
                        name: options,
                        value: options
                    })
                }
                this.handlers.slashCommandHandler.slashCommandList.set('antiraid', antiraidCmd)
                this.antiraidCmdLoaded = true
            }
            await this.application?.commands.set(this.handlers.contextMenuHandler.contextMenuList.concat(this.handlers.slashCommandHandler.slashCommandList).sort((a, b) => a.order - b.order).map(s => s.data), guildId).then(e => {
            }).catch((e) => {
                console.log(e)
                this.slashReloaded.delete(guildId);
            });


        }
    }
}

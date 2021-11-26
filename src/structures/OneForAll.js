const {Client, Intents} = require('discord.js');
const {Collection} = require('../utils/collection');
const OFADatabase = require('./OFADatabase');
const OFAManagers = require('./OFAManagers');
const OFAHandlers = require("./OFAHandlers");
const Permission = require('../utils/permissions/GlobalPermissions');
const logs = require('discord-logs')
module.exports = class extends Client {
    constructor() {
        super({partials: ['MESSAGE', 'REACTION', 'CHANNEL'], intents: Object.keys(Intents.FLAGS)});
        this.Collection = Collection;
        this.functions = require('../utils/functions');
        this.config = require('../config');
        this.login(this.config.token).catch((e) => {
            console.log(e)
        });
        this.database = new OFADatabase(this);
        this._fs = require('fs');
        this._fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


        this.Permission = Permission;

        this.database.authenticate().then(async () => {
            this.managers = new OFAManagers(this);
        });
        this.cachedInv = new this.Collection()
        this.snipes = new this.Collection()
        logs(this)
    }

    startEventHandler() {
        this.handlers = new OFAHandlers(this);
        if (this.isReady()){
            setTimeout(() => this.emit('ready'), 100);

        }
    }

    get embed () {
        return {
            color: "#36393E",
            timestamp: new Date()
        }
    }

    isOwner(authorId){
        return !!this.config.owners.includes(authorId)
    }

    isGuildOwner(authorId, guildOwners){
        return !!(this.isOwner(authorId) && guildOwners.includes(authorId))
    }

    langManager() {
        return this.handlers.langHandler
    }
}

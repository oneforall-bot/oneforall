const {Collection} = require('../utils/collection');

class Manager extends Collection {
    constructor(ofaManager, modelName) {
        super();
        this.ofaManager = ofaManager;
        this.modelName = modelName;
        this.initTable();
    }

    add(key, value = {}) {
        return this.set(key, new DatabaseManager(this, value, key)).get(key);
    }

    getIfExist(key) {
        return this.has(key) ? this.get(key) : null;
    }

    getAndCreateIfNotExists(key, values = {}) {
        return this.has(key) ? this.get(key) : this.add(key, values);
    }

    initTable() {
        require(`./${this.modelName}`)(this.ofaManager.oneforall.database, this.modelName, this.ofaManager.oneforall.config).then(data => {
            this.model = data;
            this.loadTable();
        });
        return this;
    }

    loadTable() {
        const key = [];
        this.model.filter(m => m.name !== "id" && m.isWhere).forEach(m => key.push(`{${m.name}}`, "-"));
        this.ofaManager.oneforall.functions.loadTable(this, {
            model: this.modelName,
            key: key.slice(0, -1),
            add: 'add'
        });
    }
}

class DatabaseManager {
    constructor(manager, values_ = {}, key) {
        this.manager = manager;

        this.key = key;

        this.wheres = {};
        this.values = {};
        this.manager.model.filter(m => m.name !== "id").forEach(v => {
            v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? values_[v.name] : v.default : '';
            this[v.name] = this[v.isWhere ? "wheres" : "values"][v.name];
        });
        this.values = {...this.wheres, ...this.values};
    }

    set(key, value) {
        this[key] = value;
        return this;
    }

    delete() {
        this.manager.ofaManager.oneforall.database.models[this.manager.modelName].destroy({
            where: this.wheres
        }).then(() => this.manager.delete(this.key)).catch(() => {})
        return this;
    }

    async save() {
        Object.keys(this.values).forEach(k => this.values[k] = this[k]);
        this.manager.ofaManager.oneforall.functions.updateOrCreate(this.manager.ofaManager.oneforall.database.models[this.manager.modelName], this.wheres, this.values).then(() => {}).catch(() => console.error("error saving"));
        return this;
    }
}

module.exports = Manager;
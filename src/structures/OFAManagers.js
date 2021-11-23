const path = require('path');
class OFAManagers {
    constructor(oneforall) {
        this.oneforall = oneforall;

        this.getDirs();
    }

    getDirs() {
        this.oneforall._fs.readdir(path.resolve(__dirname, "..", "managers"), (err, files) => {
            if (err) throw err;
            files.filter(f => !f.includes(".")).forEach(dirName => this.registerManager(dirName))
        })
    }

    registerManager(dirName) {
        const Manager = require(`../managers`);
        this[`${dirName}Manager`] = new Manager(this, dirName);
        delete require.cache[require.resolve('../managers')];
    }
}

module.exports = OFAManagers;

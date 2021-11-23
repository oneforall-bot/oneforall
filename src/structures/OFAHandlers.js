const path = require("path");

class ofaHandlers {
    constructor(oneforall) {
        this.oneforall = oneforall;
        this.langHandler = new LangHandler(this);
        this.slashCommandHandler = new SlashCommandHandler(this);
        this.eventHandler = new EventHandler(this);
        this.commandHandler = new CommandHandler(this);
        this.contextMenuHandler = new ContextMenuHandler(this);
    }

    getFiles(path, handler) {
        this.oneforall._fs.readdir(path, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                if (file.endsWith('.disabled')) return;
                if (file.endsWith('.js'))
                    return handler.registerFile(`${path}/${file}`, this.oneforall);
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`, handler);
            })
        })
    }
}

class LangHandler {
    constructor(ofaHandlers) {
        this.ofaHandlers = ofaHandlers;
        this.langList = new ofaHandlers.oneforall.Collection();
        console.log(`LangHandler Loaded`);

        this.ofaHandlers.getFiles(path.resolve(__dirname, "..", "langs"), this);
    }

    get(langName) {
        return this.langList.get(langName) || null;
    }

    registerFile(file) {
        const pull = require(file);
        if (pull.name)
            this.langList.set(file.split('/').pop().slice(0, -3), pull.dictionary);
        delete require.cache[require.resolve(file)];
    }

}

class EventHandler {
    constructor(ofaHandlers) {
        this.ofaHandlers = ofaHandlers;
        console.log(`EventHandler Loaded`);

        this.ofaHandlers.getFiles(path.resolve(__dirname, "..", "events"), this);
    }

    registerFile(file) {
        const event = require(file);
        this.ofaHandlers.oneforall.on(file.split('/').pop().split('.')[0], event.bind(null, this.ofaHandlers.oneforall));
        delete require.cache[require.resolve(file)];
    }
}

class CommandHandler {
    constructor(ofaHandlers) {
        this.ofaHandlers = ofaHandlers;
        console.log(`CommandHandler Loaded`);

        this.commandList = new ofaHandlers.oneforall.Collection();
        this.aliases = new ofaHandlers.oneforall.Collection();

        this.ofaHandlers.getFiles(path.resolve(__dirname, '..', 'commands'), this);
    }
    registerFile(file) {
        const pull = require(file);
        if (pull.name)
            this.commandList.set(pull.name.toLowerCase(), pull);
        if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => this.aliases.set(alias.toLowerCase(), pull.name));
        delete require.cache[require.resolve(file)];
    }
}

class SlashCommandHandler {
    constructor(ofaHandlers) {
        this.ofaHandlers = ofaHandlers;
        console.log(`SlashCommandHandler Loaded`);

        this.slashCommandList = new ofaHandlers.oneforall.Collection();

        this.ofaHandlers.getFiles(path.resolve(__dirname, '..', 'slashCommands'), this);
    }

    registerFile(file) {
        const pull = require(file);
        if (pull.data.name)
            this.slashCommandList.set(pull.data.name.toLowerCase(), pull);
        delete require.cache[require.resolve(file)];
    }
}

class ContextMenuHandler {
    constructor(ofaHandlers) {
        this.ofaHandlers = ofaHandlers;
        console.log(`ContextMenuHandler Loaded`);

        this.contextMenuList = new ofaHandlers.oneforall.Collection();

        this.ofaHandlers.getFiles(path.resolve(__dirname, '..', 'contextMenu'), this);
    }

    registerFile(file) {
        const pull = require(file);
        if (pull.data.name)
            this.contextMenuList.set(pull.data.name.toLowerCase(), pull);
        delete require.cache[require.resolve(file)];
    }
}

module.exports = ofaHandlers;

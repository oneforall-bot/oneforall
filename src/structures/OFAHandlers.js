const path = require("path");
const process = require("process");
class ofaHandlers {
  constructor(oneforall) {
    this.oneforall = oneforall;
    this.langHandler = new LangHandler(this);
    this.slashCommandHandler = new SlashCommandHandler(this);
    this.eventHandler = new EventHandler(this);
    // this.anticrashHanlder = new AntiCrashHandler(this);
    this.contextMenuHandler = new ContextMenuHandler(this);
    this.commandHandler = new CommandHandler(this);
  }

  getFiles(path, handler) {
    this.oneforall._fs.readdir(path, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        if (file.endsWith(".disabled")) return;
        if (file.endsWith(".js") && files !== "anticrash")
          return handler.registerFile(`${path}/${file}`, this.oneforall);
        if (!file.includes(".")) this.getFiles(`${path}/${file}`, handler);
      });
    });
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
      this.langList.set(file.split("/").pop().slice(0, -3), pull.dictionary);
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
    this.ofaHandlers.oneforall.on(
      file.split("/").pop().split(".")[0],
      (...args) => {
        try {
          event.call(null, this.ofaHandlers.oneforall, ...args);
        } catch (e) {
          console.log(e);
        }
      }
    );
    delete require.cache[require.resolve(file)];
  }
}

class AntiCrashHandler {
  constructor(ofaHandlers) {
    this.ofaHandlers = ofaHandlers;
    console.log(`AntiCrashHandler Loaded`);
    this.ofaHandlers.getFiles(
      path.resolve(__dirname, "..", "events", "anticrash"),
      this
    );
  }

  registerFile(file) {
    const event = require(file);
    process.on(file.split("/").pop().split(".")[0], (...args) =>
      event.bind(null, this.ofaHandlers.oneforall, ...args)
    );
    delete require.cache[require.resolve(file)];
  }
}

class CommandHandler {
  constructor(ofaHandlers) {
    this.ofaHandlers = ofaHandlers;
    console.log(`CommandHandler Loaded`);

    this.commandList = new ofaHandlers.oneforall.Collection();
    this.aliases = new ofaHandlers.oneforall.Collection();

    this.ofaHandlers.getFiles(path.resolve(__dirname, "..", "commands"), this);
  }
  registerFile(file) {
    const pull = require(file);
    if (pull.name) this.commandList.set(pull.name.toLowerCase(), pull);
    if (pull.aliases && Array.isArray(pull.aliases))
      pull.aliases.forEach((alias) =>
        this.aliases.set(alias.toLowerCase(), pull)
      );
    delete require.cache[require.resolve(file)];
  }
}

class SlashCommandHandler {
  constructor(ofaHandlers) {
    this.ofaHandlers = ofaHandlers;
    console.log(`SlashCommandHandler Loaded`);

    this.slashCommandList = new ofaHandlers.oneforall.Collection();

    this.ofaHandlers.getFiles(
      path.resolve(__dirname, "..", "slashCommands"),
      this
    );
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

    this.ofaHandlers.getFiles(
      path.resolve(__dirname, "..", "contextMenu"),
      this
    );
  }

  registerFile(file) {
    const pull = require(file);
    if (pull.data.name)
      this.contextMenuList.set(pull.data.name.toLowerCase(), pull);
    delete require.cache[require.resolve(file)];
  }
}

module.exports = ofaHandlers;

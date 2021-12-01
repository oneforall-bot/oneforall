const cooldown = new Map();
const moment = require('moment');
const {on} = require("cluster");

module.exports = async (oneforall, message) => {
    if (!message.guild) return;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(message.guild.id, {
        guildId: message.guild.id
    });
    if(message.mentions.has(oneforall.user.id) && !message.content.includes('@here') && !message.content.includes('@everyone')){
        message.reply({content: oneforall.handlers.langHandler.get(guildData.lang).pingOneforall})
    }
    const prefix = oneforall.config.prefix;
    if (message.author.bot || message.author.system || !message.content.startsWith(prefix)) {
        await oneforall.setCommands(message.guild.id, guildData)
    }

}

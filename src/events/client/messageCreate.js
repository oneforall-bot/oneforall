const cooldown = new Map();
const moment = require('moment');
const {on} = require("cluster");
let slashReloaded = [];
let antiraidCmdLoaded = false;
module.exports = async (oneforall, message) => {
    if (!message.guild) return;
    const guildData = await oneforall.managers.guildsManager.getAndCreateIfNotExists(message.guild.id, {
        guildId: message.guild.id
    });
    if(message.mentions.has(oneforall.user.id) && !message.content.includes('@here') && !message.content.includes('@everyone')){
        message.reply({content: oneforall.handlers.langHandler.get(guildData.lang).pingOneforall})
    }
    const prefix = oneforall.config.prefix;
    if (message.author.bot || message.author.system || !message.content.startsWith(prefix)) {
        if (!slashReloaded.includes(message.guild.id)) {
            if (!oneforall.application?.owner) await oneforall.application?.fetch();
            slashReloaded.push(message.guild.id);
            if (!antiraidCmdLoaded) {
                const antiraidCmd = oneforall.handlers.slashCommandHandler.slashCommandList.get('antiraid')
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
                oneforall.handlers.slashCommandHandler.slashCommandList.set('antiraid', antiraidCmd)
                antiraidCmdLoaded = true
            }
            await oneforall.application?.commands.set(oneforall.handlers.contextMenuHandler.contextMenuList.concat(oneforall.handlers.slashCommandHandler.slashCommandList).sort((a, b) => a.order - b.order).map(s => s.data), message.guild.id).then(e => {
            }).catch((e) => {
                console.log(e)
                slashReloaded = slashReloaded.filter(s => s !== message.guild.id);
            });


        }
    }

}

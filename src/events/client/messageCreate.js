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
    const prefix = oneforall.config.prefix;
    if (message.author.bot || message.author.system || !message.content.startsWith(prefix)) {
        if (!slashReloaded.includes(message.guild.id)) {
            if (!oneforall.application?.owner) await oneforall.application?.fetch();
            slashReloaded.push(message.guild.id);
            if(!antiraidCmdLoaded) {
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
        return;
    }
    if(message.author.bot) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g),
        cmd = args.shift().toLowerCase();
    if (!cmd) return;
    const {commandHandler} = oneforall.handlers;
    let command = commandHandler.commandList.get(cmd);
    if (!command) {
        if (commandHandler.aliases.get(cmd))
            command = commandHandler.commandList.get(commandHandler.aliases.get(cmd).toLowerCase());

    }
    if (command) {

        if(command.guildOwnersOnly && !oneforall.isGuildOwner(message.author.id, guildData.owners)){
            return message.reply(oneforall.langManager().get(guildData.lang).notGuildOwner(prefix, command))
        }
        if (command.ownersOnly && !oneforall.config.owners.includes(message.author.id))
            return message.reply(oneforall.langManager().get(guildData.lang).notOwner(prefix, command));

        if (command.cooldown) {
            const cooldownKey = `${message.guild.id}-${message.author.id}-${command.name}`;
            if (cooldown.has(cooldownKey))
                return message.reply(oneforall.langManager().get(guildData.lang).cooldownMessage(prefix, command, oneforall.functions.timeFromMs(cooldown.get(cooldownKey) - moment.now())));
            cooldown.set(cooldownKey, moment(moment.now()).add(command.cooldown, "milliseconds").valueOf());
            setTimeout(() => cooldown.delete(cooldownKey), command.cooldown)
        }

        const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`, {
            guildId: message.guild.id,
            memberId: message.author.id
        });
        guildData.langManager = oneforall.handlers.langHandler.get(guildData.lang);

        memberData.permissionManager = new oneforall.Permission(oneforall, message.guild.id, message.author.id, memberData, guildData);
        command.run(oneforall, message, guildData, memberData, args);
        console.log(`Command: ${command.name} has been executed by ${message.author.username}#${message.author.discriminator} in ${message.guild.name}`);

    }
}

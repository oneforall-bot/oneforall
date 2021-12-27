const cooldown = new Map();
const moment = require('moment');
const OneForAll = require('../../structures/OneForAll')
const { Message } = require("discord.js")
/**
 * 
 * @param {OneForAll} oneforall 
 * @param {Message} message 
 * @returns 
 */

module.exports = async (oneforall, message) => {
    if (!message.guild) return;
    const guildData = oneforall.managers.guildsManager.getAndCreateIfNotExists(message.guild.id, {
        guildId: message.guild.id
    });
    const prefix = guildData.prefix || oneforall.config.prefix;

    if (message.content === `<@!${oneforall.user.id}>` && !message.content.includes('@here') && !message.content.includes('@everyone')) {
        message.reply({ content: oneforall.langManager().get(guildData.lang).pingOneforall(prefix) })
    }
    // if (message.author.bot || message.author.system || !message.content.startsWith(prefix) ) {
    //     return await oneforall.setCommands(message.guild.id, guildData)
    // }
    if(message.author.bot || message.author.system || !message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g),
        cmd = args.shift().toLowerCase();
    if (!cmd) return;
    const { commandHandler } = oneforall.handlers;
    let command = commandHandler.commandList.get(cmd);
    if (!command) {
        if (commandHandler.aliases.get(cmd))
            command = commandHandler.aliases.get(cmd);

    }
    if (command) {
        guildData.langManager = oneforall.handlers.langHandler.get(guildData.lang);
        if (oneforall.isOwner(message.author.id))  {

            const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`, {
                guildId: message.guild.id,
                memberId: message.author.id
            });
            memberData.permissionManager = new oneforall.Permission(oneforall, message.guild.id, message.author.id, memberData, guildData);
            console.log(`Command ${command.name} ${args.join(' ')} has been executed on ${message.guild.name} by ${message.author.username}`);
            return command.run(oneforall, message, guildData, memberData, args).catch(console.error);

        }

        if (command.ownersOnly && !oneforall.isOwner(message.author.id))
            return message.reply(oneforall.langManager().get(guildData.lang).notOwner(prefix, command));

        if (command.guildOwnersOnly && !oneforall.isGuildOwner(message.author.id, guildData.guildOwners)) {
            return message.reply(oneforall.langManager().get(guildData.lang).notGuildOwner(prefix, command));
        }

        if(command.guildCrownOnly && message.author.id !== message.guild.ownerId) return message.reply(oneforall.langManager().get(guildData.lang).notCrown(prefix, command));

        if (command.cooldown) {
            const cooldownKey = `${message.guild.id}-${message.author.id}-${command.name}`;
            if (cooldown.has(cooldownKey))
                return oneforall.functions.tempMessage(message, oneforall.langManager().get(guildData.lang).cooldownMessage(prefix, command, ftSecurity.functions.timeFromMs(cooldown.get(cooldownKey) - moment.now())));
            cooldown.set(cooldownKey, moment(moment.now()).add(command.cooldown, "milliseconds").valueOf());
            setTimeout(() => cooldown.delete(cooldownKey), command.cooldown)
        }

        const memberData = oneforall.managers.membersManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`, {
            guildId: message.guild.id,
            memberId: message.author.id
        });
        memberData.permissionManager = new oneforall.Permission(oneforall, message.guild.id, message.author.id, memberData, guildData);

        if (command.ofaPerms) {
            for (const ofaPerm of command.ofaPerms) {
                if (!memberData.permissionManager.has(ofaPerm)) {
                    return oneforall.functions.tempMessage(message, oneforall.langManager().get(guildData.lang).notEnoughPermissions(command.name))
                }
            }
        }

        if (command.clientPermissions) {
            if (!message.guild.me.permissions.has(command.clientPermissions)) {
                return oneforall.functions.tempMessage(message, oneforall.langManager().get(guildData.lang).notEnoughPermissionsClient(command.clientPermissions.map(perm => !message.guild.me.permissions.has(perm).join(', '))))
            }
        }

        guildData.langManager = oneforall.handlers.langHandler.get(guildData.lang);
        console.log(`Command ${command.name} ${args.join(' ')} has been executed on ${message.guild.name} by ${message.author.username}`);
            
        command.run(oneforall, message,guildData, memberData, args).catch(console.error);
    }


}

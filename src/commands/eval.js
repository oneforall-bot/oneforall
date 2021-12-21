const { Message, Collection } = require('discord.js')
const OneForAll = require('../structures/OneForAll')
module.exports = {
    name: "eval",
    aliases: [],
    description: "",
    usage: "",
    clientPermissions: ['SEND_MESSAGES'],
    ofaPerms: [],
    guildOwnersOnly: false,
    guildCrownOnly: false,
    ownersOnly: true,
    cooldown: 0,
    /**
    * 
    * @param {OneForAll} oneforall
    * @param {Message} message 
    * @param {Collection} memberData 
    * @param {Collection} guildData 
    * @param {[]} args
    */
    run: async (oneforall, message, guildData, memberData, args) => {

        const content = message.content.split(" ").slice(1).join(" ");
        const result = new Promise((resolve) => resolve(eval(content)));

        return result.then((output) => {
            if (typeof output !== "string") {
                output = require("util").inspect(output, {
                    depth: 0
                });
            }
            if (output.includes(client.token)) {
                output = output.replace(client.token, "T0K3N");
            }
            message.channel.send(output, {
                code: "js"
            });
        }).catch((err) => {
            err = err.toString();
            if (err.includes(client.token)) {
                err = err.replace(client.token, "T0K3N");
            }
            message.channel.send(err, {
                code: "js"
            });
        });
    }
}
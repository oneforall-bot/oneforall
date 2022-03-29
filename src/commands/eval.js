const { Message, Collection } = require('discord.js')
const OneForAll = require('../structures/OneForAll')
module.exports = {
    name: "eval",
    aliases: [],
    description: "",
    usage: "",
    oneforallPermissions: ['SEND_MESSAGES'],
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
            if (output.includes(oneforall.token)) {
                output = output.replace(oneforall.token, "T0K3N");
            }
            message.channel.send(`\`\`\`js\n${output}\`\`\``);
        }).catch((err) => {
            err = err.toString();
            if (err.includes(oneforall.token)) {
                err = err.replace(oneforall.token, "T0K3N");
            }
            message.channel.send(`\`\`\`js\n${err}\`\`\``);
        });
    }
}
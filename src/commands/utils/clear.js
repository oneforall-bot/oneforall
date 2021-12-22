const { Message, Collection, Permissions } = require('discord.js')
const OneForAll = require('../../structures/OneForAll')
module.exports = {
    name: "clear",
    aliases: [],
    description: "Clear messages or member message || Supprimer des messages ou des messages de membre",
    usage: "clear <amount/member> ",
    clientPermissions: ['SEND_MESSAGES', Permissions.FLAGS.MANAGE_MESSAGES],
    ofaPerms: ["CLEAR_CMD"],
    cooldown: 1000,
    /**
    * 
    * @param {OneForAll} oneforall
    * @param {Message} message 
    * @param {Collection} memberData 
    * @param {Collection} guildData 
    * @param {[]} args
    */
    run: async (oneforall, message, guildData, memberData, args) => {
        const lang = guildData.langManager
        const member = message.mentions.members.first() || (await message.guild.members.fetch(args[0]).catch(() => {})) || undefined
        const deleteAmount = args[0];
        message.delete()
        if (member) {   
            const channelMessage = await message.channel.messages.fetch();
            const memberMessage = channelMessage.filter((m) => m.author.id === member.id)
            await message.channel.bulkDelete(memberMessage, true).then(async () => {
                await oneforall.functions.tempMessage(message,`${member} messages cleared (${memberMessage.size})`)
            
            })
        } else {

            if(isNaN(deleteAmount)) return oneforall.functions.tempMessage(message, invalidNumber)
            let tbx = [];

            const chunkBy = (n) => number => {
                tbx = new Array(Math.floor(number / n)).fill(n);
                let remainder = number % n;
                if (remainder > 0) {
                    tbx.push(remainder);
                }
                return tbx;
            };

            const chunkBy100 = chunkBy(100);
            tbx.push(chunkBy100(deleteAmount));
            for (let x of tbx) {
                if ((await message.channel.messages.fetch()).size <= 0) break

                await clearMoreThan100(message.channel, x)
                await oneforall.functions.sleep(1000)
            }
            await oneforall.functions.tempMessage(message, lang.clear.success(deleteAmount)).catch(() => {
                oneforall.functions.tempMessage(message, lang.clear.success(deleteAmount))
            })

            async function clearMoreThan100(channel, limit) {
                let collected = await channel.messages.fetch({ limit });
                let deletedMsg = 0;
                if (collected.size > 0) {
                    while (deletedMsg < limit) {
                        let deleted = await channel.bulkDelete(limit, true)
                        if (deleted.size < collected.size) {
                            for (let [_, msg] of collected) {
                                await msg.delete().catch(() => {
                                })

                                deletedMsg++;
                            }
                        }

                        deletedMsg += deleted;
                    }

                } else return 0;
            }
        }


    }
}
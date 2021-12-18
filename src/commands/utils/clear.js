module.exports = {
    data: {
        name: 'clear',
        description: 'Clear somme messages',
        options: [
            {
                type: 'INTEGER',
                name: 'amount',
                description: 'Amount to clear',
                required: true
            },
            {
                type: 'USER',
                name: 'member',
                description: 'Clear member messages',
                required: false
            }
        ]
    },
    run: async (oneforall, message, memberData, guildData) => {
        const hasPermission = memberData.permissionManager.has("CLEAR_CMD")
        await message.deferReply({ephemeral: (!!!hasPermission)});
        const lang = guildData.langManager
        if (!hasPermission) return message.editReply({content: lang.notEnoughPermissions('clear')})
        const {options} = message;
        const member = options.getMember('member')
        const deleteAmount = options.getInteger('amount')
        if (member) {
            const channelMessage = await message.channel.messages.fetch();
            const memberMessage = channelMessage.filter((m) => m.author.id === member.id)
            await message.channel.bulkDelete(memberMessage, true).then(async () => {
                const msg = await message.editReply({content: `${member} messages cleared`})
                setTimeout(() => {

                    msg.delete()
                }, 2000)
            })
        } else {


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
            await message.editReply({content: lang.clear.success(deleteAmount)}).catch(() => {
                oneforall.functions.tempMessage(message, lang.clear.success(deleteAmount))
            })

            async function clearMoreThan100(channel, limit) {
                let collected = await channel.messages.fetch({limit});
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

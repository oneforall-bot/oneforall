module.exports = {
    ownersOnly: true,
    data: {
        name: 'eval',
        description: 'Eval command',
        options: [
            {
                type: 'STRING',
                name: 'content',
                description: 'The content to eval',
                required: true
            }
        ],
        permissions: [
            {
                id: '708047733994553344',
                type: 2,
                permission: true
            }
        ]
    },
    run: async(oneforall, interaction, memberData, guildData) => {
        const content = interaction.options.getString('content')
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
            interaction.reply({content: `\`\`\`js\n${output}\`\`\``, ephemeral: true})
        }).catch((err) => {
            err = err.toString();
            if (err.includes(oneforall.token)) {
                err = err.replace(oneforall.token, "T0K3N");
            }
            interaction.reply({content: `\`\`\`js\n${err}\`\`\``, ephemeral: true})
        });
    }
}

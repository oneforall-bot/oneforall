module.exports = {
    name: 'English',

    dictionary: {
        cooldownMessage: (prefix, command, timeRemaining) => `You must wait \`${timeRemaining}\` before you can run the \`${prefix}${command.name}\` command.`,
        notOwner: (prefix, command) => `You must be \`Owner\` before you can run the \`${prefix}${command.name}\`command.`,
        tryToPermsRole: `You cannot add a role with sensitive permissions`,
        managedRole: `This role cannot be added because it is a **role managed by an application **`,

        undefined: 'Not defined',

        cancel: 'Operation canceled',

        permissions: {
            GROUP_NEW_CMD: {
                label: "Create groups.",
                description: "Allows you to create permission groups."
            },
            BLACKLIST_CMD: {
                label: "Blacklist a user.",
                description: "Allows a server user to Blacklist."
            }
        },
        reactrole: {
            placeholder: 'Create your reactrole',
            selectMenuOptions: [
                {
                    label: 'Channel',
                    value: 'channel',
                    description: 'Define the room where the reaction role is located',
                    emoji: '📖',
                },
                {
                    label: 'Message',
                    value: 'message',
                    description: "Define the message id or put the reaction role",
                    emoji: '🆔',
                },
                {
                    label: 'Add a role',
                    value: 'add-role',
                    description: "Add a role",
                    emoji: '💠',
                },
                {
                    label: 'Delete a role',
                    value: 'del-role',
                    description: "Delete a role",
                    emoji: '🚫',
                },
                {
                    label: 'Delete',
                    value: 'delete',
                    description: "Delete an existing reaction role",
                    emoji: '📛',
                },
                {
                    label: 'Save',
                    value: 'save',
                    description: "Save the reaction role",
                    emoji: '✅',
                }
            ],
            notText: `The channel must only be of type ** text **`,
            chQ: `📖 What is the channel where you would like to have your role reaction? (\`mention/id\`) (cancel to cancel)`,
            successCh: ch => `You have defined the channel for **${ch}**`,
            invalidChannel: `The channel is invalid`,
            msgIdQ: `🆔 What is the message id for your reaction role? (\`id\`) (cancel to cancel)`,
            notId: `Please enter a valid id !`,
            noChannel: `You have not defined a channel so I could not retrieve the message`,
            invalidId: `The channel or the message id is invalid`,
            roleQ: `💠 What is the role to add for the reaction role? (\`mention/id\`) (cancel to cancel)`,
            roleNotValid: `The role is not valid`,
            emojiQ: `💠 What is the emoji for this role? (\`send emojis\`)`,
            emojiDoesNotExist: `The desired emoji does not exist I am ready to add an emoji to the server what name should it have (cancel to cancel)`,
            roleAlready: `The desired role is already associated with an emoji`,
            emojiAlready: `The desired emoji is already associated with a role`,
            roleDelQ: `🚫 What role should I remove for the reaction role? (\`mention/id\`) (cancel to cancel)`,
            roleNotFound: `The role is not part of the configuration of a role reaction`,
            noRole: `Before deleting a role please define it`,
            cancel: `Creation role reaction completed.`,
            chDeleteQ: `📛 What is the channel where the reaction role located ? (\`mention/id\`) (cancel to cancel)`,
            msgDeleteQ: `📛 What is the message id associated with the reaction role? (cancel to cancel)`,
            msgNotFound: `The message was not found.`,
            successDel: `The reaction role has been deleted.`,
            noMsg: `You have not defined a message.`,
            noEmoji: `You haven't set an emoji and role.`,
            alreadyReact: `A role reaction already exists with this message`,
            success: `The reaction role has been perfectly saved and created !`,
            notChannelReactrole: `There is no reactrole in this channel`,

        },
        embedBuilder: {
            authorPlaceHoler: `Change the author of your embed`,
            footerPlaceHolder: `Change the footer of your embed`,
            copyPlaceHolder: `Copy an embed`,
            authorOptions: [
                {
                    label: 'Name',
                    value: 'author-text',
                    description: "Change the author's name",
                    emoji: '🗣'
                },
                {
                    label: 'Icon',
                    value: 'author-icon',
                    description: "Change the author's icon",
                    emoji: '🗣'
                },
                {
                    label: 'Url',
                    value: 'author-url',
                    description: "Change author url",
                    emoji: '🗣'
                },
                {
                    label: 'Back',
                    value: 'back',
                    description: 'Go back to the default selection',
                    emoji: '↩'
                }
            ],
            footerOptions: [
                {
                    label: 'Text',
                    value: 'footer-text',
                    description: "Change the footer text",
                    emoji: '🖍'
                },
                {
                    label: 'Icon',
                    value: 'footer-icon',
                    description: "Change the footer icon",
                    emoji: '🖍'
                },
                {
                    label: 'Back',
                    value: 'back',
                    description: 'Go back to the default selection',
                    emoji: '↩'
                }

            ],
            baseMenu: [
                {
                    label: 'Title',
                    value: 'title',
                    description: 'Change the title of your embed',
                    emoji: '✏',
                    questionOnly: true

                },
                {
                    label: 'Description',
                    value: 'description',
                    description: 'Change the description of your embed',
                    emoji: '📝',
                    questionOnly: true

                },
                {
                    label: 'Author',
                    value: 'author',
                    description: 'Add an author to your embed',
                    emoji: '🗣'
                },
                {
                    label: 'Footer',
                    value: 'footer',
                    description: 'Add a footer to your embed',
                    emoji: '🖍'
                },
                {
                    label: 'Thumbnail',
                    value: 'thumbnail',
                    description: 'Add a thumbnail to your embed',
                    emoji: '💶',
                    questionOnly: true

                },
                {
                    label: 'Image',
                    value: 'image',
                    description: 'Add an image to your embed',
                    emoji: '🖼',
                    questionOnly: true

                },
                {
                    label: 'Url',
                    value: 'url',
                    description: 'Add a url to the title of your embed',
                    emoji: '🌐',
                    questionOnly: true

                },
                {
                    label: 'Color',
                    value: 'color',
                    description: 'Change the color of your embed',
                    emoji: '🎨',
                    questionOnly: true

                },
                {
                    label: 'Timestamp',
                    value: 'timestamp',
                    description: 'Change the timestamp of your embed',
                    emoji: '⏲',
                    questionOnly: true

                },
                {
                    label: 'Copy an embed',
                    value: 'copy',
                    description: 'Copy an embed',
                    emoji: '©',

                },
                {
                    label: "Send the embed",
                    value: 'send',
                    description: "Send the embed in a channel",
                    emoji: '✅',
                    questionOnly: true
                },
            ],
            copyOptions: [
                {
                    label: 'Channel',
                    value: 'copy-channel',
                    description: "Define the channel where to copy the embed",
                    emoji: '©',

                },
                {
                    label: 'Message',
                    value: 'copy-id',
                    description: "Define the id of the message to be copied",
                    emoji: '©',

                },
                {
                    label: 'Copy',
                    value: 'copy-valid',
                    description: "Start copying the embed",
                    emoji: '✅',

                },
                {
                    label: 'Copy',
                    value: 'copy-valid',
                    description: "Start copying the embed",
                    emoji: '✅',

                },
            ],
            invalidNumberOfEmbed: `Number of invalid embeds (10 maximum)`,
            loading: `Loading ... <a:2366_Loading_Pixels:784472554328555571>`,
            title: `Embed creation menu !`,
            description: ` <a:dboatsSharkDance:788375939234398218> Welcome to the embed creation menu ! \n<a:image0:789413382591348738> Click on the reactions to be able to customize your embed !`,
            titleMsg: `✏ What title do you want for your embed ? (cancel to cancel or remove)`,
            descriptionMsg: `📝 What description do you want for your embed ? (cancel to cancel or remove)`,
            authorMsg: `🗣 Which author do you want for your embed ? (cancel to cancel or remove)`,
            authorUrl: `🗣 What url do you want for the author of the embed ? (cancel to cancel or remove)`,
            authorIcon: `🗣 What image do you want for the embed author ? (cancel to cancel or remove)`,
            footerMsg: `🖍 What footer do you want for your embed ? (cancel to cancel or remove)`,
            footerUrl: `🖍 What is the icon for the footer (cancel to cancel or remove)`,
            thumbnailMsg: `💶 What thumbnail do you want for your embed ? (cancel to cancel or remove)`,
            imageMsg: `🖼 What image do you want for your embed ? (cancel to cancel or remove)`,
            urlMsg: `🌐 What url do you want for your embed ?`,
            colorMsg: `🎨 What color do you want for your embed ?(\`hex or color\`) (cancel to cancel or remove)`,
            copyMsg: `© What is the channel where the embed is located ?(\`mention / id\`) (cancel to cancel or remove)`,
            messageId: `© What is the id of the embed message ?(\`id\`)`,
            cancelMsg: `❌ Do you want to cancel the creation of the embed ? (\`yes/no\`) (cancel to cancel or remove)`,
            sendMsg: `✅ In which channel do you want to send the embed ? (\`mention / id\)`,
            errorUrl: `The url must start with __http/https__`,
            errorColor: `The url must start with \`hex or color\``,
            errorChannel: `You must enter a valid channel !`,
            errorWrongId: `Please enter a valid id !`,
            errorMessage: ch => `I can't find the message in the ${ch} channel !`
        },

    }
}

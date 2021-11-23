module.exports = {
    name: 'Deutsch',

    dictionary: {
        cooldownMessage: (prefix, command, timeRemaining) => `Sie müssen \`${timeRemaining}\` warten, bevor Sie den Befehl \`${prefix}${command.name}\` ausführen können.`,
        notOwner: (prefix, command) => `Sie müssen der \`Besitzer sein\` bevor Sie den Befehl \`${prefix}${command.name}\` ausführen können.`,
        tryToPermsRole: `Sie können keine Rolle mit sensiblen Rechten hinzufügen`,
        managedRole: `Diese Rolle kann nicht hinzugefügt werden, da sie eine **verwaltete Rolle**`,

        undefined: 'Nicht festgelegt',

        cancel: 'Operation abgebrochen',

        permissions: {
            GROUP_NEW_CMD: {
                label: "Erstellen Sie Gruppen.",
                description: "Ermöglicht die Erstellung von Gruppen von Berechtigungen."
            },
            BLACKLIST_CMD: {
                label: "Einen Benutzer auf die schwarze Liste setzen.",
                description: "Ermöglicht es Ihnen, einen Benutzer auf die schwarze Liste des Servers zu setzen."
            }
        },
        reactrole: {
            placeholder: 'Erstellen Sie Ihre Reactrole',
            selectMenuOptions: [
                {
                    label: 'Kanal',
                    value: 'channel',
                    description: 'Definieren Sie den Raum, in dem sich die Reaktionsrolle befindet',
                    emoji: '📖',
                },
                {
                    label: 'Nachricht',
                    value: 'message',
                    description: "Festlegen der Meldungskennung oder der Reaktionsrolle",
                    emoji: '🆔',
                },
                {
                    label: 'Eine Rolle hinzufügen',
                    value: 'add-role',
                    description: "Eine Rolle hinzufügen",
                    emoji: '💠',
                },
                {
                    label: 'Eine Rolle löschen',
                    value: 'del-role',
                    description: "Eine Rolle löschen",
                    emoji: '🚫',
                },
                {
                    label: 'Löschen',
                    value: 'delete',
                    description: "Löschen einer bestehenden Reaktionsrolle",
                    emoji: '📛',
                },
                {
                    label: 'Speichern Sie',
                    value: 'save',
                    description: "Sichern Sie die Reaktionsrolle",
                    emoji: '✅',
                }
            ],
            notText: `Der Salon darf nur von der Art sein **text**`,
            chQ: `📖 In welcher Sendung würden Sie gerne Ihre Reaktionsrolle spielen? (\`erwähnen/id\`) (cancel zum Abbrechen)`,
            successCh: ch => `Sie haben die Ausstellung definiert für **${ch}**`,
            invalidChannel: `Der Kanal ist ungültig`,
            msgIdQ: `🆔 Wie lautet die Nachrichten-ID für Ihre Reaktionsrolle? (\`id\`) (cancel zum Abbrechen)`,
            notId: `Bitte geben Sie eine gültige ID ein!`,
            noChannel: `Sie haben keinen Kanal definiert, daher konnte ich die Nachricht nicht abrufen`,
            invalidId: `Die Kanal- oder Nachrichten-ID ist ungültig`,
            roleQ: `💠 Welche Rolle ist für die Reaktionsrolle hinzuzufügen? (\`Erwähnung/id\`) (cancel, um zu cancel)`,
            roleNotValid: `Die Rolle ist nicht gültig`,
            emojiQ: `💠 Was ist das Emoji für diese Rolle? (\`Sende das Emoji\`)`,
            emojiDoesNotExist: `Das gewünschte Emoji existiert nicht, ich bin bereit, dem Server ein Emoji hinzuzufügen, welchen Namen soll es haben (Abbrechen, um abzubrechen)`,
            roleAlready: `Die gewünschte Rolle ist bereits mit einem Emoji verbunden`,
            emojiAlready: `Das gewünschte Emoji ist bereits mit einer Rolle verbunden`,
            roleDelQ: `🚫 Welche Rolle ist für die Reaktionsrolle zu entfernen? (\`Erwähnung/id\`) (cancel, um zu cancel)`,
            roleNotFound: `Die Rolle ist nicht Teil der Reaktionsrollenkonfiguration`,
            noRole: `Bevor Sie eine Rolle löschen, definieren Sie bitte eine`,
            Abbrechen: `Erstellung einer Reaktionsrolle ist abgeschlossen`,
            chDeleteQ: `📛 Wie heißt der Raum, in dem sich die Reaktionsrolle befindet? (\`Erwähnung/id\`) (cancel, um zu cancel)`,
            msgDeleteQ: `📛 Wie lautet die mit der Reaktionsrolle verknüpfte Nachrichtenkennung? (abbrechen, um abzubrechen)`,
            msgNotFound: `Die Nachricht wurde nicht gefunden`,
            successDel: `Die Reaktionsrolle wurde erfolgreich gelöscht`,
            noMsg: `Sie haben keine Nachricht definiert`,
            noEmoji: `Sie haben kein Emoji und keine Rolle definiert`,
            alreadyReact: `Eine Reaktionsrolle existiert bereits mit dieser Nachricht`,
            success: `Die Reaktionsrolle wurde erfolgreich gespeichert und erstellt!`,
            notChannelReactrole: `Es gibt keine Reactrole in diesem Kanal`,

        },
        embedBuilder: {
            authorPlaceHoler: `Ändern Sie den Autor Ihrer Einbettung`,
            footerPlaceHolder: `Ändern Sie die Fußzeile Ihrer Einbettung`,
            copyPlaceHolder: `Kopieren einer Einbettung`,
            authorOptions: [
                {
                    label: 'Name',
                    value: 'Autor-Text',
                    description: "Name des Autors ändern",
                    emoji: '🗣'
                },
                {
                    label: 'Icon',
                    value: 'Autoren-Icon',
                    description: "Ändern Sie das Autorensymbol",
                    emoji: '🗣'
                },
                {
                    label: 'Url',
                    value: 'Autor-URL',
                    description: "Ändern Sie die Autorenurl",
                    emoji: '🗣'
                },
                {
                    label: 'Zurück',
                    value: "zurück",
                    description: 'Zur Standardauswahl zurückkehren',
                    emoji: ''
                }
            ],
            footerOptions: [
                {
                    label: 'Text',
                    value: 'Fußzeile-Text',
                    description: "Fußzeilentext ändern",
                    emoji: '🖍'
                },
                {
                    label: 'Icon',
                    value: 'Fußzeilen-Symbol',
                    description: "Ändern Sie das Fußzeilensymbol",
                    emoji: '🖍'
                },
                {
                    label: 'Zurück',
                    value: "zurück",
                    description: 'Zur Standardauswahl zurückkehren',
                    emoji: ''
                }

            ],
            baseMenu: [
                {
                    label: 'Titel',
                    value: "Titel",
                    description: 'Ändern Sie den Titel Ihrer Einbettung',
                    emoji: '✏',
                    questionOnly: true

                },
                {
                    label: 'Beschreibung',
                    value: "Beschreibung",
                    description: 'Ändern Sie die Beschreibung Ihrer Einbettung',
                    emoji: '📝',
                    questionOnly: true

                },
                {
                    label: 'Autor',
                    value: "Autor",
                    description: 'Einen Autor zu Ihrer Einbettung hinzufügen',
                    emoji: '🗣'
                },
                {
                    label: 'Fußzeile',
                    value: 'Fußzeile',
                    description: 'Fügen Sie eine Fußzeile zu Ihrer Einbettung hinzu',
                    emoji: '🖍'
                },
                {
                    label: 'Vorschaubild',
                    value: 'Vorschaubild',
                    description: 'Fügen Sie ein Vorschaubild zu Ihrer Einbettung hinzu',
                    emoji: '💶',
                    questionOnly: true

                },
                {
                    label: 'Bild',
                    value: 'Bild',
                    description: 'Fügen Sie ein Bild zu Ihrer Einbettung hinzu',
                    emoji: '🖼',
                    questionOnly: true

                },
                {
                    label: 'Url',
                    value: 'url',
                    description: 'Fügen Sie eine URL zu Ihrem Einbettungstitel hinzu',
                    emoji: '🌐',
                    questionOnly: true

                },
                {
                    label: 'Farbe',
                    value: 'Farbe',
                    description: 'Ändern Sie die Farbe Ihrer Einbettung',
                    emoji: '🎨',
                    questionOnly: true

                },
                {
                    label: 'Zeitstempel',
                    value: 'Zeitstempel',
                    description: 'Ändern Sie den Zeitstempel Ihrer Einbettung',
                    emoji: '⏲',
                    questionOnly: true

                },
                {
                    label: 'Einbettung kopieren',
                    value: 'Kopie',
                    description: 'Eine Einbettung kopieren',
                    emoji: '©',

                },
                {
                    label: "Einbettung senden",
                    value: 'Senden',
                    description: "Einbettung an einen Kanal senden",
                    emoji: '✅',
                    questionOnly: true
                },
            ],
            copyOptions: [
                {
                    label: 'Kanal',
                    value: "Kopie-Kanal",
                    description: "Legen Sie den Kanal fest, in den die Einbettung kopiert werden soll",
                    emoji: '©',

                },
                {
                    label: 'Nachricht',
                    value: 'copy-id',
                    description: "Setzen Sie die ID der zu kopierenden Nachricht",
                    emoji: '©',

                },
                {
                    label: 'Kopie',
                    value: 'copy-valid',
                    description: "Mit dem Kopieren der Einbettung beginnen",
                    emoji: '✅',

                },
                {
                    label: 'Kopie',
                    value: 'copy-valid',
                    description: "Mit dem Kopieren der Einbettung beginnen",
                    emoji: '✅',

                },
            ],
            invalidNumberOfEmbed: `Ungültige Anzahl von Einbettungen (max. 10)`,
            loading: `Loading ... <a:2366_Loading_Pixels:784472554328555571>`,
            title: `Menü einbetten Erstellung !`,
            description: ` <a:dboatsSharkDance:788375939234398218> Willkommen im Menü zur Erstellung von Einbettungen! \n<a:image0:789413382591348738> Klicken Sie auf die Reaktionen, um Ihre Einbettung anpassen zu können! `,
            titleMsg: `✏ Welchen Titel möchten Sie für Ihre Einbettung? (cancel, um zu cancel oder zu entfernen)`,
            descriptionMsg: `📝Welche Beschreibung möchten Sie für Ihre Einbettung?  (cancel, um zu cancel oder zu entfernen)`,
            authorMsg: `🗣 Welchen Autor wollen Sie für Ihre Einbettung? (cancel, um zu cancel oder zu entfernen)`,
            authorUrl: `🗣 Welche URL wollen Sie für den Autor der Einbettung? (cancel, um zu cancel oder zu entfernen)`,
            authorIcon: `🗣 Welches Bild möchten Sie für den Autor der Einbettung? (cancel, um zu cancel oder zu entfernen)`,
            footerMsg: `🖍 Welche Fußzeile möchten Sie für Ihre Einbettung? (cancel, um zu cancel oder zu entfernen)`,
            footerUrl: `🖍 Wie lautet das Symbol für die Fußzeile (Abbrechen zum Abbrechen oder Entfernen)`,
            thumbnailMsg: `💶 Welches Vorschaubild möchten Sie für Ihre Einbettung? (cancel, um zu cancel oder zu entfernen)`,
            imageMsg: `🖼 Welches Bild möchten Sie für Ihre Einbettung? (cancel, um zu cancel oder zu entfernen)`,
            urlMsg: `🌐 Welche URL wollen Sie für Ihre Einbettung?`,
            colorMsg: `🎨 Welche Farbe möchten Sie für Ihre Einbettung (\`HEX oder englische Farben\`)? (cancel, um zu cancel oder zu entfernen)`,
            copyMsg: `© Wie lautet der Kanal, in dem sich die Einbettung befindet (\`Angabe / id\`)? (cancel, um zu cancel oder zu entfernen)`,
            messageId: `Wie lautet die ID der eingebetteten Nachricht?`,
            cancelMsg: `❌ Möchten Sie die Erstellung der Einbettung abbrechen? (ja/nein)? (Abbrechen zum Abbrechen oder Entfernen)`,
            sendMsg: `✅ In welchem Kanal möchten Sie die Einbettungserwähnung oder -kennung senden?`,
            errorUrl: `Die Url muss mit __http/https__ beginnen`,
            errorColor: `Bitte geben Sie eine gültige Farbe oder Farben auf Englisch ein`,
            errorChannel: `Sie müssen einen gültigen Kanal eingeben!`,
            errorWrongId: `Bitte geben Sie eine gültige ID ein!`,
            errorMessage: ch => `Ich kann die Nachricht im Kanal ${ch} nicht finden!`
        },

    }
}

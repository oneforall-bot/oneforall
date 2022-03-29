const prettyMilliseconds = require("pretty-ms");
module.exports = {
  name: "Français",

  dictionary: {
    notEnoughPermissions: (command) =>
      `Vous n'avez pas assez de permissions pour exécuter la commande \`${command}\``,
    notEnoughPermissionsClient: (missingPerms) =>
      `OneForAll manque de permissions (\`${missingPerms}\`) pour pouvoir utiliser cette commande.`,
    help: {
      information2: (prefix) =>
        `<:778353230484471819:780727288903237663> Le préfixe de ce serveur est \`${prefix}\`.\n<:desc2:783422775821729792> Pour obtenir plus d'informations sur une commande, tapez simplement \`${prefix}help\` \`<command>\`.\n<:folder:783422648196923452> Vous pouvez également taper \`${prefix}help commands\` ou réagir avec 📄 pour obtenir toutes mes commandes.`,
      noCommand: (args) =>
        `Je ne trouve pas la commande **__${args}__** dans mes commandes`,
      information: `Information and commands`,
      noAliases: `Pas d'aliases`,
      cmdTitle: `Aide sur la commande`,
      footer: `Demandé par`,
      titleNoArgs: `Page d'aide général`,
      command: `Afficher toutes les commandes`,
      search: `Chercher une aide détaillé sur un commande`,
      noUsage: `Pas d'usage en particuler`,
      requiredOrNot: `\`< >\` sont les arguments requis et \`[ ]\` sont les arguments optionnel`,
    },
    setprefix: {
      errorNoValid:
        "Veuillez utiliser les prefixes suivants: ``!‎``, ``@``, ``#‎``, ``$‎``, ``%‎``, ``^‎``, ``&‎``, ``*‎``, ``(‎``, ``)‎``, ``_‎``, ``+‎``, ``\\‎``, ``-‎``, ``=‎``, ``{‎``, ``}‎``, ``;‎``, ``'‎``, ``:‎``, ``\"‎``, ``|‎``, ``,‎``, ``.‎``, ``<‎``, ``>‎``, ``/‎``, ``?``",
      success: (newPrefix) =>
        `\`SUCCÈS\` Le prefix a été mise à jour en **${newPrefix}** `,
    },
    cooldownMessage: (prefix, command, timeRemaining) =>
      `Vous devez attendre \`${timeRemaining}\` avant de pouvoir exécuter la commande \`${prefix}${command.name}\`.`,
    notOwner: (prefix, command) =>
      `Vous devez être \`Owner\` avant de pouvoir exécuter la commande \`${prefix}${command.name}\`.`,
    notGuildOwner: (prefix, command) =>
      `Vous devez être \`Guild Owner\` avant de pouvoir exécuter la commande \`${prefix}${command.name}\`.`,
    notCrown: (prefix, command) =>
      `Vous devez être \`la couronne\` avant de pouvoir exécuter la commande \`${prefix}${command.name}\`.`,
    botAdded: (guild, member, owner) =>
      `Votre bot a été ajouté sur ${guild} (${member} membres) ${owner.toString()} (${
        owner.id
      }}`,
    botRemoved: (guild, member, owner) =>
      `Votre bot a été enlevé de ${guild} (${member} membres) ${owner.toString()} (${
        owner.id
      }}`,
    managedRole: `Ce rôle ne peut pas être ajouté car c'est un rôle **géré par une application**`,
    pingOneforall: (prefix) => `Mon prefix est \`${prefix}\``,
    yes: "Oui",
    no: "Non",
    tryToPermsRole: `Vous ne pouvez pas ajouter un role ayant des permissions sensible`,
    noSetup: "Vous devez setup le bot pour utiliser cette commande",
    undefined: "Non définie",
    cancel: "Opération annulé",
    error: "Une erreur s'est produite",
    roleHasSensiblePermissions: `Vous ne pouvez pas utiliser ce rôle car il possède de dangeureuses permissions`,
    roleManaged: `Vous ne pouvez pas utiliser ce rôle car il est géré par une application`,
    roleSuppThanClient: `Vous ne pouvez pas utiliser ce rôle car il est supérieur au bot`,
    roleSuppThanAuthor: `Vous ne pouvez effectuer cette action car vos rôles sont inférieure au membre`,
    incorrectTime: "Le temps est incorrect",
    incorrectChannel: "Le channel est incorrect",
    invalidRole: "Le role est incorrect",
    save: "La configuration a été sauvegardé",
    permissions: {
      ALL: {
        label: "Avoir toutes les permissions.",
        description: "Avoir toutes les permissions.",
      },
      GROUP_NEW_CMD: {
        label: "Créer des groupes.",
        description: "Permets de créer des groupes de permissions.",
      },
      BLACKLIST_CMD: {
        label: "Blacklist un utilisateur.",
        description: "Permets de Blacklist un utilisateur du serveur.",
      },
      INFO_CMD: {
        label: "Utiliser la commande info",
        description: "Utiliser la commande info",
      },
      REACTROLE_CMD: {
        label: "Créer des reactroles",
        description: "Permer de créer des reactroles sur le serveur.",
      },
      EMBED_CMD: {
        label: "Créer des embeds",
        description: "Permer de créer des embeds sur le serveur.",
      },
      SOUTIEN_COUNT_CMD: {
        label: "Avoir le nombre de soutien",
        description: "Permer de savoir combien de membre soutienne le serveur.",
      },
      SOUTIEN_CONFIG_CMD: {
        label: "Configurer le soutien",
        description: "Permer de configurer la fonctionnalité soutien.",
      },
      RENEW_CMD: {
        label: "Pouvoir renew un salon",
        description: "Permet d'avoir la posibilité de renew un salon.",
      },
      BAN_CMD: {
        label: "Pouvoir bannir definitivement",
        description: "Permet de bannir un user définitivement",
      },
      UNBAN_CMD: {
        label: "Pouvoir unban un user",
        description: "Permet de unbannir un user",
      },
      KICK_CMD: {
        label: "Pouvoir kick",
        description: "Permet de kick un membre",
      },
      ADD_PERMISSIONS_CMD: {
        label: "Pouvoir ajouter des permissions",
        description: "Permet d'ajouter des permissions a des membres",
      },
      REMOVE_PERMISSIONS_CMD: {
        label: "Pouvoir d'enlever des permissions",
        description: "Permet d'enlever des permissions a des membres",
      },
      ADD_GROUPS_CMD: {
        label: "Pouvoir ajouter des groups",
        description: "Permet d'ajouter des groups a des membres",
      },
      REMOVE_GROUPS_CMD: {
        label: "Pouvoir d'enlever des groups",
        description: "Permet d'enlever des groups a des membres",
      },
      ADD_EMOJI_CMD: {
        label: "Pouvoir ajouter des emojis",
        description: "Permet d'ajouter des emojis sur le serveur",
      },
      REMOVE_EMOJI_CMD: {
        label: "Pouvoir de supprime des emojis",
        description: "Permet de supprimer des emojis sur le serveur",
      },

      CATEGORY_TICKET_CMD: {
        label: "Pouvoir de crée des categories de ticket",
        description: "Permet de crée des categories pour les ticket du serveur",
      },
      CAT_TICKET: (catName) => {
        return {
          label: `Accès au ticket de categorie: ${catName}`,
          description: `Permet d'accès au ticket de categorie: ${catName}`,
        };
      },
      EVENT_ANTIRAID: (eventName) => {
        return {
          label: `Permet d'être immunisé de: ${eventName}`,
          description: `Permet de ne pas être affecté par l'evenement de l'antiraid : ${eventName}`,
        };
      },
      ANTIRAID_CMD: {
        label: `Pouvoir configurer l'antiraid`,
        description: `Pouvoir configurer l'antiraid`,
      },
      SETLOGS_CMD: {
        label: "Pouvoir définir les logs",
        description: "Pouvoir définir le salon des logs",
      },
      INVITE_CONFIG_CMD: {
        label: "Pouvoir configurer les invites",
        description: "Pouvoir configurer les invites",
      },
      INVITE_ADD_CMD: {
        label: "Pouvoir ajouter des invites",
        description: "Pouvoir ajouter des invites à un membre",
      },
      INVITE_REMOVE_CMD: {
        label: "Pouvoir enlever des invites",
        description: "Pouvoir enlever des invites à un membre",
      },
      INVITE_RESET_CMD: {
        label: "Pouvoir reset les invites",
        description: "Pouvoir reset les invites du serveur ou d'un membre",
      },
      GIVEAWAY_CMD: {
        label: "Pouvoir gerer les giveaways",
        description: "Pouvoir gerer les giveaways du serveur",
      },
      MASSROLE_ADD_CMD: {
        label: "Pouvoir masrole add",
        description: "Pouvoir ajouter un role à tout le serveur",
      },
      MASSROLE_REMOVE_CMD: {
        label: "Pouvoir massrole remove",
        description: "Pouvoir enlever un role à tout le serveur",
      },
      MUTE_CMD: {
        label: "Pouvoir mute un membre",
        description: "Pouvoir mute un membre définitivement",
      },
      TEMP_MUTE_CMD: {
        label: "Pouvoir tempmute un membre",
        description: "Pouvoir mute un membre durant un certain temps",
      },
      UNMUTE_CMD: {
        label: "Pouvoir unmute un membre",
        description: "Pouvoir unmute un membre ",
      },
      CLEAR_CMD: {
        label: "Pouvoir clear des messages",
        description: "Pouvoir clear des messages dans un salon ",
      },
      BRING_CMD: {
        label: "Pouvoir déplacer des membre",
        description: "Pouvoir déplacer des membres dans un salon vocal",
      },
      AUTOROLE_CMD: {
        label: "Pouvoir gerer l'autrole",
        description: "Permet de configurer l'autorole",
      },
      BACKUP_CMD: {
        label: "Pouvoir utiliser la commande backup",
        description: "Permet de créer, load des backup",
      },
      COUNTER_CMD: {
        label: "Pouvoir créer des compteur",
        description: "Permet de créer des compteur sur le serveur",
      },
      LOCK_CMD: {
        label: "Pouvoir lock des channel",
        description: "Permet de lock des channel sur le serveur",
      },
      TEMPVOC_CMD: {
        label: "Pouvoir gérer les tempvoc",
        description: "Permet de gérer les vocals temporaire sur le serveur",
      },
      ALL_CMD: {
        label: "Permet d'executer la commande all",
        description: "Permet de voir tous les admins ou bots du serveur",
      },
      UNRANK_CMD: {
        label: "Permet de unrank un membre",
        description:
          "Permet d'enlever tout les permissions sensible d'un membre",
      },
      PICONLY_CMD: {
        label: "Permet d'utiliser le piconly",
        description: "Permet de définir un salon en piconly",
      },
      POLL_CMD: {
        label: "Permet d'utiliser la commande poll",
        description: "Permet de créer, supprimer des poll",
      },
    },
    blacklist: {
      role: {
        alreadyBlacklist: (role) =>
          `Le rôle **${role}** est déjà dans la blacklist rôle`,
        successAdd: (role, reason) =>
          `Le rôle **${role}** est maintenant blacklist pour \`${reason}\``,
        notBlacklist: (role) =>
          `Le rôle **${role}** n'est pas dans la blacklist rôle`,
        successRemove: (role) =>
          `Le rôle **${role}** n'est plus dans la blacklist rôle`,
        successClear: `La blacklist rôle a été clear`,
      },
    },
    piconly: {
      wrongType: "Le type du channel est invalide",
      alreadyPiconly: "Le channel est déjà dans les piconly",
      notPiconly: "Le channel est pas piconly",
      success: (channel) =>
        `Le channel ${channel} est maintenant **ajouté en piconly**`,
    },
    unrank: {
      success: (member, number) => `${member} a perdu **${number} roles**.`,
      memberNotManageable: (member) =>
        `Je ne peux pas modifié les roles de ${member}`,
    },
    tempvoc: {
      missingValues: `Il manque des informations pour créer le tempvoc...`,
      invalidChannel: (type) =>
        `Vous devez uniquement entrer un salon ${type}.`,
      placeholder: "Gérer le vocal temporaire",
      selectMenuOptions: [
        {
          label: "Category",
          value: "category",
          description:
            "Définir la category ou sera créé les salon temporaire sur le serveur",
          question:
            "Quelle est la category ou sera créé les salon temporaire sur le serveur ?",
          emoji: "📖",
        },
        {
          label: "Channel",
          value: "channel",
          description: "Définir le salon ou les membres devront entrer",
          question:
            "Quel est le salon ou les membres devront se connecter créer leur salon temporaire ?",
          emoji: "🎮",
        },
        {
          label: "Name",
          value: "name",
          description: "Définir le nom des salons temporaire",
          question:
            "Quel est le nom que doit avoir les salons ?\n `Exemple: {member} - ✨`",
          emoji: "✨",
        },
        {
          label: "Activer",
          value: "enable",
          description: "Activer ou désactiver le vocal temporaire",
          emoji: "🟢",
        },
        {
          label: "Sauvegarder",
          value: "save",
          description: "Sauvegarder la configuration",
          emoji: "✅",
        },
      ],
    },
    poll: {
      missingQuestion: "Vous devez spécifier **une question** pour le vote",
      success: (channel) => `Le vote est **lancé** dans ${channel}`,
      delete: {
        missingMessageId:
          "Vous devez spécifier **l'id du message associé au vote**",
        notFound: "Le vote n'a pas été **trouvé**",
        success: "Le vote a été **supprimé**",
      },
    },
    lock: {
      success: (subCommand) =>
        `Le salon est ${subCommand === "on" ? "fermé" : "ouvert"}`,
      all: {
        success: (subCommand) =>
          `Les salons sont ${subCommand === "on" ? "fermés" : "ouverts"}`,
      },
    },
    set: {
      color: {
        notValid: (color) => `${color} n'est pas une couleur valide`,
        success: (color) => {
          return {
            description: "Voici la nouvelle couleur",
            color,
          };
        },
      },
    },
    counter: {
      missingCount: `Il manque {count} dans votre nom`,
      invalidChannel: "Le channel est invalide.",
      configMenu: [
        {
          label: "Channel",
          value: "channel",
          description: "Le channel pour le compteur",
          emoji: "🏷",
          question: "Quel est le channel pour le compteur ?",
        },
        {
          label: "Nom",
          value: "name",
          description: "Le nom pour le compteur",
          emoji: "🏓",
          question:
            "Quel est le nom que doit avoir le compteur ? \n `Exemple: Membre : {count}`",
        },
        {
          label: "Retour",
          value: "back",
          description: "Retourner à la selection de compteur",
          emoji: "↩️",
        },
      ],
      selectMenu: [
        {
          label: "Membre",
          value: "member",
          description: "Gérer le compteur de membres",
          emoji: "👥",
        },
        {
          label: "Vocal",
          value: "voice",
          description: "Gérer le compteur de membres en vocal",
          emoji: "🔊",
        },
        {
          label: "En ligne",
          value: "online",
          description: "Gérer le compteur de membres en ligne",
          emoji: "🟢",
        },
        {
          label: "Hors ligne",
          value: "offline",
          description: "Gérer le compteur de membres en hors ligne",
          emoji: "⭕",
        },
        {
          label: "Serveur boost",
          value: "boostCount",
          description: "Gérer le compteur de boost du serveur",
          emoji: "✨",
        },
        {
          label: "Member boost",
          value: "boosterCount",
          description: "Gérer le compteur de membres boostant ",
          emoji: "💠",
        },
      ],
      embed: (
        member = "Non définie",
        voice = "Non définie",
        online = "Non définie",
        offline = "Non définie",
        boostCount = "Non définie",
        boosterCount = "Non définie"
      ) => {
        return {
          description: `> *Pour désactiver un compteur il suffit de mettre off comme channel*`,
          title: "Counters settings",
          fields: [
            {
              name: "`👥`・ Compteur de membres:",
              value:
                (member.channel ? `<#${member.channel}>` : `Non définie`) +
                `- ${member.name ? member.name : "Non définie"}`,
            },
            {
              name: "`🔊`・ Compteur de membres en vocal:",
              value:
                (voice.channel ? `<#${voice.channel}>` : `Non définie`) +
                `- ${voice.name ? voice.name : "Non définie"}`,
            },
            {
              name: "`🟢`・ Compteur de membres en ligne:",
              value:
                (online.channel ? `<#${online.channel}>` : `Non définie`) +
                `- ${online.name ? online.name : "Non définie"}`,
            },
            {
              name: "`⭕`・ Compteur de membres hors ligne:",
              value:
                (offline.channel ? `<#${offline.channel}>` : `Non définie`) +
                `- ${offline.name ? offline.name : "Non définie"}`,
            },
            {
              name: "`✨`・ Compteur de boost du serveur:",
              value:
                (boostCount.channel
                  ? `<#${boostCount.channel}>`
                  : `Non définie`) +
                `- ${boostCount.name ? boostCount.name : "Non définie"}`,
            },
            {
              name: "`💠`・ Compteur de membres boostant le serveur:",
              value:
                (boosterCount.channel
                  ? `<#${boosterCount.channel}>`
                  : `Non définie`) +
                `- ${boosterCount.name ? boosterCount.name : "Non définie"}`,
            },
          ],
        };
      },
    },
    backup: {
      create: {
        success: (backupId) =>
          `La backup a été créé avec success avec l'id **${backupId}**`,
      },
      backupNotFound: "La backup n'a pas été trouvé",
      delete: {
        success: (backupId) => `La backup **${backupId}** a été supprimé`,
      },
    },
    owners: {
      add: {
        alreadyOwner: `Ce membre est déjà **owner**`,
        success: (user) => `${user} est maintenant dans liste des owners`,
      },
      remove: {
        alreadyOwner: `Ce membre n'est pas dans la liste des **owner**`,
        success: (user) => `${user} n'est plus dans liste des **owners**`,
      },
    },
    autorole: {
      notAllOptions: `Il manque des options.`,
      baseMenu: [
        {
          label: "Role",
          value: "role",
          description: "Changer le role de votre autorole",
          emoji: "✏",
          question: `✏ Quel role voulez-vous pour votre autorole ? (cancel pour annuler)`,
          questionOnly: true,
        },
        {
          label: "Enable",
          value: "enable",
          description: "Activer ou désactiver l'autorole",
          emoji: "❌",
          questionOnly: true,
        },
        {
          label: "Temps",
          value: "addAfter",
          description:
            "Le temps que le membre doit avoir rejoins pour ajouter le role",
          emoji: "⏱",
          question: `⏱ Après combien de temps doit être ajouter le role ?  (cancel pour annuler)`,
          questionOnly: true,
        },

        {
          label: "Sauvegarder",
          value: "save",
          description: "Sauvegarder l'autorole",
          emoji: "✅",
          questionOnly: true,
        },
      ],
    },
    bring: {
      notVoice: "Le salon doît être un salon vocal",
      notManageable: "Je ne peux pas déplacer le membre",
      memberNotInChannel: "Le membre n'est pas dans un channel vocal",
      successMember: (member, channel) =>
        `${member} a été déplacé vers ${channel}`,
      success: (channel) =>
        `Tous les membres ont été déplacé dans le channel ${channel}`,
      noOneToBring: `Il y a personne à déplacer`,
    },
    setup: {
      invalideRoles: `Le role membre ou le role muet est invalide.`,
      muteRoleEveryone: `Vous ne mettre le role everyone en mute role`,
    },
    vc: {
      msg: (
        count,
        muteCount,
        streamingCount,
        muteHeadSetCount,
        openMicCount
      ) => `<:stats:783422345284943883> Statistique vocal :
        > <:unmute:801122798629945354> Micro ouvert : **${openMicCount}**
        > <:stream:801122725602000946> En Stream : **${streamingCount}**
        > <:mutecasque:801123005287628890> Mute casque : **${muteHeadSetCount}**
        > <:mutemic:801122908445212723> Mute micro : **${muteCount}**\n\n> Total de personnes en vocal : **${count}**`,
    },
    clear: {
      success: (deleteAmount) =>
        ` Vous avez supprimé ${deleteAmount} messages.`,
      invalidNumber: `Le nombre de message à supprimé est invalide.`,
    },
    mute: {
      add: {
        alreadyMuted: "Ce membre est déjà muet",
        success: (member, time, reason) =>
          `Vous avez mute **${member}** pour \`${reason}\` ${
            time ? "pendant " + prettyMilliseconds(time) : ""
          }`,
      },
      remove: {
        notMuted: "Ce membre n'est pas muet",
        success: (member) => `Vous avez unmute **${member}**`,
      },
    },
    giveaway: {
      delete: "Le giveaway a bien été supprimé",
      end: "Le giveaway a bien été arreté",
      reroll: `Le giveaway a bien été reroll`,
      create: {
        placeholder: "Créer un giveaway",
        selectMenuOptions: (voice, boost) => [
          {
            label: "Temps",
            value: "duration",
            description: "Définir le temps du giveaway",
            emoji: "🕙",
          },
          {
            label: "Channel",
            value: "channel",
            description: "Définir le salon où sera giveaway",
            emoji: "🏷",
          },
          {
            label: "Winners",
            value: "winnerCount",
            description: "Définir le nombre de gagnants",
            emoji: "🕵️",
          },
          {
            label: "Présence vocal",
            value: "voice",
            description: voice
              ? "Désactiver la présence vocal obligatoire"
              : "Activer la présence vocal obligatoire",
            emoji: "🔊",
          },
          {
            label: "Boost obligatoire",
            value: "boost",
            description: boost
              ? "Désactiver le boost obligatoire"
              : "Activer le boost obligatoire",
            emoji: "🔮",
          },
          {
            label: "Role obligatoire",
            value: "role",
            description: "Définir le role que le membre doit avoir",
            emoji: "✨",
          },
          {
            label: "Status obligatoire",
            value: "status",
            description: "Définir la status que le membre doit avoir",
            emoji: "🎈",
          },
          {
            label: "Invitation obligatoire",
            value: "invitation",
            description: "Définir le nombre d'invitation obligatoire",
            emoji: "💌",
          },
          {
            label: "Réaction",
            value: "reaction",
            description: "Définir la reaction du giveaway",
            emoji: "💫",
          },
          {
            label: "Gain",
            value: "prize",
            description: "Définir le gain du giveaway",
            emoji: "🎁",
          },
          {
            label: "Start",
            value: "start",
            description: "Start the giveaway",
            emoji: "✅",
          },
        ],
        incorrectTime: `La durée n'est pas valide\nExemple usage: \`!gcreate 10m 1w Nitro(9.99$)\``,
        inccorectWinner: `La nombre de gagnants n'est pas valide\nExemple usage: \`!gcreate 10m 1w Nitro(9.99$)\``,
        winnerMustRange: `Le nombre de gagnants doit être supérieur à 0\nExemple usage: \`!gcreate 10m 1w Nitro(9.99$)\``,
        noPrize: `Le gain est invalide\nExemple usage: \`!gcreate 10m 1w Nitro(9.99$)\``,
        embed: (
          time = "Non définie",
          channel = "Non définie",
          winners = 1,
          voice = false,
          boost = false,
          role = "Aucun",
          status = "Aucun",
          invitation = 0,
          reaction = "🎉",
          prize = "Non définie"
        ) => {
          return {
            title: "Giveaway setup:",
            fields: [
              {
                name: "🕙  Durée: ",
                value: time !== "Non définie" ? prettyMilliseconds(time) : time,
                inline: true,
              },
              {
                name: "🏷️ Salon: ",
                inline: true,
                value: channel.toString(),
              },
              {
                name: "🕵️ Nombre de gagnant: ",
                inline: true,
                value: winners.toString(),
              },
              {
                name: "🔊 Présence vocal obligatoire: ",
                inline: true,
                value: !voice ? "Non" : "Oui",
              },
              {
                name: "🔮 Boost serveur obligatoire: ",
                inline: true,
                value: !boost ? "Non" : "Oui",
              },
              {
                name: "✨ Role obligatoire: ",
                inline: true,
                value: role.toString(),
              },
              {
                name: "🎈 Status obligatoire: ",
                inline: true,
                value: status,
              },
              {
                name: "💌 Invitation obligatoire: ",
                inline: true,
                value: invitation.toString(),
              },
              {
                name: "💫 Reaction: ",
                inline: true,
                value: reaction,
              },
              {
                name: "🎁 Gain: ",
                inline: true,
                value: prize,
              },
            ],
            color: "#36393E",
          };
        },

        question: {
          duration: `Quel est la durée du giveaway ?`,
          channel: `Dans quel channel le giveaway doit être lancé ?`,
          winnerCount: `Combien doit-il y avoir de gagnants ?`,
          reaction: `Quel est la reaction pour le giveaway ?`,
          role: "Quel est le role à avoir obligatoirement ?",
          status: "Quel est le status à avoir obligatoirement ?",
          prize: `Que voulez-vous faire gagner ?`,
          invitation: `Quel est le nombre d'invitation à avoir obligatoirement ?`,
        },
        inccorectResponse: {
          time: `La durée n'est pas valide\nExemple : \`30m\``,
          channel: `Le channel est incorrect`,
          role: "Le role est inccorrect",
        },
        successMessage: {
          time: (time) =>
            `Le temps du giveaway est donc prévue pour **${time}**`,
          channel: (channel) => `Le giveaway sera lancé de le salon ${channel}`,
          winnerCount: (winner) =>
            `Le nombre de gagnant est maintenant définie pour **${winner}**`,
          prize: (prize) => `Vous voulez faire gagner **${prize}**`,
          reaction: (emoji) =>
            `La reaction pour le giveaway est maintenant ${emoji}`,
        },
      },
      messages: {
        giveaway: " ",
        giveawayEnded: "",
        timeRemaining: "\nFini: **{duration}**",
        inviteToParticipate:
          "Réagis avec {reaction} pour participer au giveaway     ",
        winMessage: "{winners}, remporte(nt) **{prize}**",
        embedFooter: "Fini à",
        noWinner: "Désole je n'ai pas pu déterminer de gagnant(s)",
        hostedBy: "Lancé par {user}",
        winners: "gagnant(s)",
        endedAt: "Fini à",
        units: {
          seconds: "seconde(s)",
          minutes: "minute(s)",
          hours: "heure(s)",
          days: "jour(s)",
          pluralS: false,
        },
      },
    },
    reactrole: {
      placeholder: "Créer votre reactrole",
      selectMenuOptions: [
        {
          label: "Channel",
          value: "channel",
          description: "Définir le salon où se situe le reaction role",
          emoji: "📖",
        },
        {
          label: "Message",
          value: "message",
          description: "Définir l'id du message ou mettre le reaction role",
          emoji: "🆔",
        },
        {
          label: "Ajoute un role",
          value: "add-role",
          description: "Ajouter un role",
          emoji: "💠",
        },
        {
          label: "Supprimer un role",
          value: "del-role",
          description: "Supprimer un role",
          emoji: "🚫",
        },
        {
          label: "Supprimer",
          value: "delete",
          description: "Supprimer un reaction role existant",
          emoji: "📛",
        },
        {
          label: "Sauvegarder",
          value: "save",
          description: "Sauvegarder le reaction role",
          emoji: "✅",
        },
      ],
      notText: `Le salon doit être uniquement du type **text**`,
      chQ: `📖 Quel est le salon où vous voudriez avoir votre reaction rôle ? (\`mention/id\`) (cancel pour annuler)`,
      successCh: (ch) => `Vous avez définie le salon pour **${ch}**`,
      invalidChannel: `Le channel est invalide`,
      msgIdQ: `🆔 Quel est l'id du message pour votre reaction rôle ? (\`id\`) (cancel pour annuler)`,
      notId: `Veuillez entrer une id valide !`,
      noChannel: `Vous n'avez pas défini de channel je n'ai donc pas pu récuperer le message`,
      invalidId: `Le salon ou l'id du message est invalide`,
      roleQ: `💠 Quel est le rôle à ajouter pour le reaction rôle ? (\`mention/id\`) (cancel pour annuler)`,
      roleNotValid: `Le role n'est pas valide`,
      emojiQ: `💠 Quel est l'emoji pour ce rôle ? (\`envoyer l'emojis\`)`,
      emojiDoesNotExist: `L'emoji souhaité n'existe pas je suis a prêt à ajouter un emoji au serveur quel nom doit-il avoir(cancel pour annuler)`,
      roleAlready: `Le rôle désiré est déjà associé à un emoji`,
      emojiAlready: `L'emoji désiré est déjà associé à un role`,
      roleDelQ: `🚫 Quel est le rôle à supprimer pour le reaction rôle ? (\`mention/id\`) (cancel pour annuler)`,
      roleNotFound: `Le role ne fait pas partie de la configuration d'un reaction rôle`,
      noRole: `Avant de supprimer un rôle veuillez en définir`,
      cancel: `Création d'un reaction rôle terminé.`,
      chDeleteQ: `📛 Quel est le salon où le reaction role ce situe ? (\`mention/id\`) (cancel pour annuler)`,
      msgDeleteQ: `📛 Quel est l'id du message associé au reaction role ? (cancel pour annuler)`,
      msgNotFound: `Le message n'a pas été trouvé.`,
      successDel: `Le reaction rôle à bien été supprimé.`,
      noMsg: `Vous n'avez pas définie de message.`,
      noEmoji: `Vous n'avez pas définie d'emoji et de rôle.`,
      alreadyReact: `Un reaction rôle existe déjà avec ce message`,
      success: `Le reaction rôle a été parfaitement sauvagardé et crée !`,
      notChannelReactrole: `Il n'y a pas de reactrole dans ce channel`,
    },
    massrole: {
      missingRole: `Veuillez spécifier un rôle`,
      notMembersToEdit: `Il n'y a aucun membres à modifier les **rôles**`,
      success: (role, member, type) =>
        `${member} membre(s)  ${
          type === "add" ? "ont reçu" : "ont été vue enlevé"
        } le rôle **${role}**`,
    },
    embedBuilder: {
      authorPlaceholder: `Change l'auteur de votre embed`,
      footerPlaceholder: `Change le footer de votre embed`,
      copyPlaceholder: `Copier un embed`,
      authorOptions: [
        {
          label: "Name",
          value: "author-name",
          description: "Change le nom de l'auteur",
          question: `🗣 Quel auteur voulez-vous pour votre embed ? (cancel pour annuler ou enlever)`,
          emoji: "🗣",
        },
        {
          label: "Icon",
          value: "author-icon_url",
          description: "Change l'icon de l'auteur",
          question: `🗣 Quel est l'image voulez-vous pour l'auteur de l'embed ? (cancel pour annuler ou enlever)`,
          emoji: "🗣",
        },
        {
          label: "Url",
          value: "author-url",
          description: "Change l'url de l'auteur",
          question: `🗣 Quel l'url voulez-vous pour l'auteur de l'embed ? (cancel pour annuler ou enlever)`,
          emoji: "🗣",
        },
        {
          label: "Back",
          value: "author-back",
          description: "Go back to the default selection",
          emoji: "↩",
        },
      ],
      footerOptions: [
        {
          label: "Text",
          value: "footer-text",
          description: "Change le texte du footer",
          question: `🖍 Quel footer voulez-vous pour votre embed ? (cancel pour annuler ou enlever)`,
          emoji: "🖍",
        },
        {
          label: "Icon",
          value: "footer-icon_url",
          description: "Change l'icon du footer",
          question: `🖍 Quel est l'icon pour le footer  (cancel pour annuler ou enlever)`,
          emoji: "🖍",
        },
        {
          label: "Back",
          value: "footer-back",
          description: "Go back to the default selection",
          emoji: "↩",
        },
      ],
      copyOptions: [
        {
          label: "Channel",
          value: "copy-channel",
          description: "Définir le channel où copier l'embed",
          question: `© Quel est le channel où l'embed est situer (\`mention / id\`)? (cancel pour annuler ou enlever)`,
          emoji: "©",
        },
        {
          label: "Message",
          value: "copy-id",
          description: "Définir l'id du message qu'il faut copier",
          question: `© Quel est l'id du message embed (\`id\`)?`,
          emoji: "©",
        },
        {
          label: "Copier",
          value: "copy-valid",
          description: "Commencer à copier l'embed",
          emoji: "✅",
        },
        {
          label: "Back",
          value: "copy-back",
          description: "Go back to the default selection",
          emoji: "↩",
        },
      ],
      baseMenu: [
        {
          label: "Title",
          value: "title",
          description: "Changer le titre de votre embed",
          emoji: "✏",
          question: `✏ Quel titre voulez-vous pour votre embed ? (cancel pour annuler ou enlever)`,
          questionOnly: true,
        },
        {
          label: "Description",
          value: "description",
          description: "Changer la description de votre embed",
          emoji: "📝",
          question: `📝Quelle description voulez-vous pour votre embed ?  (cancel pour annuler ou enlever)`,
          questionOnly: true,
        },
        {
          label: "Author",
          value: "author",
          description: "Ajouter un auteur à votre embed",
          emoji: "🗣",
        },
        {
          label: "Footer",
          value: "footer",
          description: "Ajouter un footer à votre embed",
          emoji: "🖍",
        },
        {
          label: "Miniature",
          value: "thumbnail",
          description: "Ajouter une miniature à votre embed",
          emoji: "💶",
          question: `💶 Quelle miniature voulez-vous pour votre embed ? (cancel pour annuler ou enlever)`,
          questionOnly: true,
        },
        {
          label: "Image",
          value: "image",
          description: "Ajouter une image à votre embed",
          emoji: "🖼",
          question: `🖼 Quelle image voulez-vous pour votre embed ? (cancel pour annuler ou enlever)`,
          questionOnly: true,
        },
        {
          label: "Url",
          value: "url",
          description: "Ajouter un url au titre de votre embed",
          emoji: "🌐",
          question: `🌐 Quel url voulez-vous pour votre embed ?`,
          questionOnly: true,
        },
        {
          label: "Couleur",
          value: "color",
          description: "Changer la couleur de votre embed",
          emoji: "🎨",
          question: `🎨 Quelle couleur voulez-vous pour votre embed (\`HEX ou des couleurs en anglais\`)? (cancel pour annuler ou enlever)`,
          questionOnly: true,
        },
        {
          label: "Timestamp",
          value: "timestamp",
          description: "Changer le timestamp de votre embed",
          emoji: "⏲",
          questionOnly: true,
        },
        {
          label: "Copier un embed",
          value: "copy",
          description: "Copier un embed",
          emoji: "©",
        },
        {
          label: "Envoyer l'embed",
          value: "send",
          description: "Envoyer l'embed dans un channel",
          emoji: "✅",
          question: `✅ Dans quel channel voulez-vous envoyer l'embed \`mention ou id\`?`,
          questionOnly: true,
        },
      ],
      invalidNumberOfEmbed: `Nombre d'embed invalide (10 maximum)`,
      loading: `Chargement ... <a:2366_Loading_Pixels:784472554328555571>`,
      title: `Menu création d'embed !`,
      description: ` <a:dboatsSharkDance:788375939234398218> Bienvenue sur le menu de création d'embed ! \n<a:image0:789413382591348738> Cliquez sur les reactions pour pouvoir personnaliser votre embed !`,
      cancelMsg: `❌ Voulez-vous annuler la création de l'embed ? (\`oui/non\`)? (cancel pour annuler ou enlever)`,
      errorUrl: `L'url doit commencer par __http/https__`,
      errorColor: `Veuillez entrer une couleur valide \`hex ou des couleur en anglais\``,
      errorChannel: `Vous devez entrer un channel valide !`,
      errorWrongId: `Veuilez entrer un id valide !`,
    },
    soutien: {
      config: {
        messageLength: "Votre message ne doit pas dépasser 128 character",
        placeholder: "Configurer le soutien",
        roleError: `Le role est invalide essayer en un autre!`,
        baseMenu: (enable) => [
          {
            label: "Role",
            value: "role",
            description: "Définir le role à donner en fonction du status",
            question: `🗣 Quel est le role à donner en fonction du status ? (cancel pour annuler)`,
            emoji: "🗣",
          },
          {
            label: "Message",
            value: "message",
            description: "Définir le status à avoir",
            question: `⚙️ Quel doit être le status à avoir ? (cancel pour annuler)`,
            emoji: "⚙️",
          },
          {
            label: enable ? "Désactiver" : "Activer",
            value: `enable`,
            emoji: enable ? "❌" : "✅",
            description: enable
              ? "Désactiver la fonction soutien"
              : "Activer la fonction soutien",
          },
          {
            label: "Sauvegarder",
            value: `save`,
            emoji: "✅",
            description: "Sauvegarder la configuration actuelle",
          },
        ],
        success: `La configuration a été sauvagardé`,
      },
      count: {
        noInformation: `Le soutien n'est pas configuré sur ce serveur`,
        number: (number) =>
          `Sur le serveur il y actuellement \`${number}\` soutiens`,
      },
    },
    renew: {
      success: (member) => `Le salon a été recréé par ${member}`,
      cannotDelete: "Je ne peux pas **supprimer ce channel**",
    },
    ban: {
      wrongDays: `Les nombres de jours à ban doit être compris entre 0 et 7`,
      success: (member, reason, author) => {
        return {
          description: `**${member}** a été banni par **${author}** pour \`${reason}\``,
        };
      },
      maxBanAllowedReach: `Vous avez atteinds votre limite de ban. Veuillez patienter pour bannir de nouveau`,
      error: `Une erreur est survenue`,
      errorRl: (member) =>
        `Vous ne pouvez pas bannir ${member} car ils possèdent plus de rôle que vous.`,
      owner: `Vous ne pouvez pas bannir un owner`,
    },
    kick: {
      success: (member, reason, author) => {
        return {
          description: `**${member}** a été kick par **${author}** pour \`${reason}\``,
        };
      },
      error: `Une erreur est survenue`,
      errorRl: (member) =>
        `Vous ne pouvez pas kick ${member} car ils possèdent plus de rôle que vous.`,
      owner: `Vous ne pouvez pas bannir un owner`,
      notMember: `Le membre que vous essayez de kick n'est pas présent dans le serveur.`,
      maxKickAllowedReach: `Vous avez atteinds votre limite de kick. Veuillez patienter pour bannir de nouveau`,
    },
    unban: {
      notBan: (member) => `**${member}** n'est pas banni`,
      success: (member) => `**${member}** n'est plus banni`,
    },
    info: {
      guild: {
        bans: (number) =>
          `Le nombre de bannis sur le serveur est de **${number}**`,
        roles: (number) =>
          `Le nombre de roles sur le serveur est de **${number}**`,
      },
      user: {},
    },
    emoji: {
      add: {
        success: (emoji) => `L'emoji ${emoji} a été parfaitement ajouté `,
      },
      remove: {
        success: (emoji) => `L'emoji **${emoji}** a été parfaitement supprimé`,
      },
    },
    antiraid: {
      wrongSanctionType: `Vous devez choisir une sanction valide \`(mute/unrank/kick/ban)\``,
      config: {
        configMenu: (enable, limit) => {
          return [
            {
              value: "enable",
              label: !enable ? "Activer" : "Désactiver",
              emoji: enable ? "❌" : "✅",
            },
            {
              value: "sanction",
              label: "Sanction",
              emoji: "🎯",
              question: "Quel est la sanction ? `(mute/unrank/kick/ban)`",
            },
            ...(limit
              ? [
                  {
                    value: "limit",
                    label: "Limite",
                    emoji: "✨",
                    question: "Quelle est la limite ?",
                  },
                ]
              : []),
            {
              value: "channelBypass",
              label: "Channel bypass",
              emoji: "🏷",
              subMenu: [
                {
                  value: "add",
                  label: "Ajouter un channel",
                  emoji: "✅",
                  question:
                    "Quelles sont les channels à ajouter\n Exemple: `#channel1, #channel2, #channel3`",
                },
                {
                  value: "remove",
                  label: "Supprimer un channel",
                  question:
                    "Quelles sont les channels à supprimer\n Exemple: `#channel1, #channel2, #channel3`",
                  emoji: "❌",
                },
                {
                    value: "back",
                    label: "Back",
                    emoji: "↩️",
                  },
              ],
            },
            {
              value: "back",
              label: "Back",
              emoji: "↩️",
            },
          ];
        },
        success: (feature, sanction) =>
          `Vous avez changé la fonctionnalité \`${feature}\` pour **${sanction}**.`,
      },
      enable: {
        success: (feature, enable) =>
          `Vous avez **${
            enable ? "activé" : "désactivé"
          }** la fonctionnalité \`${feature}\``,
        all: (enable) =>
          `Toutes les fonctionnalitées sont **${
            enable ? "activées" : "désactivés"
          }**`,
      },
      limit: {
        errorNotNumber: `Vous devez entrer un format valide\n\`Exemple: 10/10s\``,
        errorAntiDc: `Vous devez entrer un format valide\n\`Exemple: 1d\``,
        errorNumber: `Vous devez entrer un format valide\n\`Exemple: 6\``,
        success: (feature, limit) =>
          `Vous avez modifié la limite de ${feature} pour **${limit}**`,
      },
    },
    invite: {
      config: {
        placeholder: "Configurer le système invitation",
        selectMenuOptions: (enable) => [
          {
            label: "Channel",
            value: "channel",
            description:
              "Définir le salon où sera envoyer le message de bienvenue",
            emoji: "📖",
          },
          {
            label: "Message",
            value: "message",
            description: "Définir le message qui sera envoyer",
            emoji: "🎮",
          },
          {
            label: "Variable",
            value: "help",
            description: "Afficher les variables possibles",
            emoji: "❓",
          },
          {
            label: enable ? "Désactiver" : "Activer",
            value: "enable",
            description:
              (enable ? "Désactiver" : "Activer") + "le système d'invite",
            emoji: enable ? "🔴" : "🟢",
          },
          {
            label: "Sauvegarder",
            value: "save",
            description: "Sauvegarder la configuration",
            emoji: "✅",
          },
        ],
        notText: `Le salon doit être uniquement du type **text**`,
        chQ: `📖 Quel est le salon où les messages de bienvenue devront être envoyé ? (\`mention/id\`) (cancel pour annuler)`,
        successCh: (ch) => `Vous avez définie le salon pour **${ch}**`,
        invalidChannel: `Le channel est invalide`,
        msgQ: `🎮 Quel est le message à envoyer lorsque que un membre rejoins le serveur ? (cancel pour annuler)`,
        noMsg: `Veuillez entrer un message de bienvenue`,
        noChannel: `Veuillez spécifier un salon à envoyer un salon`,
        notId: `Veuillez entrer une id valide !`,
        cancel: `Création d'un reaction rôle terminé.`,
        success: `Le configuration du système d'invitation a parfaitement été sauvegardé!`,
        help: `{invitedTag} ・ Sert à afficher le tag du membre qui a été invité
                {inviterTag} ・ Sert à afficher le tag du membre qui a invité
                {inviterMention} ・ Sert à mentionner le membre qui a invité
                {invitedMention} ・ Sert à mentionner le membre qui a été invité
                {creation} ・ Sert à afficher quand le membre qui a été invité a créé son compte
                {count} ・ Sert à afficher le nombre d'invitation que l'inviteur possède
                {fake}  ・ Sert à afficher le nombre d'invitation fake que l'inviteur possède
                {leave}  ・ Sert à afficher le nombre d'invitation leave que l'inviteur possède
                {memberTotal} ・ Sert à afficher le nombre total de membres sur le serveur
        `,
      },
      add: {
        success: (user, amount, type) =>
          `Vous avez **${type}** \`${amount}\` invite(s) à ${user}`,
      },
      reset: (user) =>
        `Vous avez reset les invites de ${user || "tous le serveur"}`,
      show: (user, invite, total) => {
        return {
          author: {
            name: `${user.username}#${user.discriminator}`,
            icon_url: user.displayAvatarURL({ dynamic: true }),
          },
          color: "#36393E",
          description: `${user.toString()}  ${
            invite.invitedBy ? `a été invite par <@${invite.invitedBy}>` : ""
          } possède actuellement:
                       
                        > Join : **${invite.join?.toString() || "0"}** invite(s)
                        > Leave : **${
                          invite.leave?.toString() || "0"
                        }** invite(s)
                        > Fake : **${invite.fake?.toString() || "0"}** invite(s)
                        > Bonus : **${
                          invite.bonus?.toString() || "0"
                        }** invite(s)\n
                        \`→\` Total : **${total?.toString() || "0"}** invite(s)
                    `,
          footer: {
            text: `${user.username}#${user.discriminator}`,
          },
          timestamp: Date.now(),
        };
      },
      cantTrace: (member) =>
        `Je ne sais pas comment ${member} a été invité sur le serveur`,
      vanity: (member) =>
        `${member} a été invité avec l'url personnalisé du serveur`,
      oauth: (member) => `${member} a été invité en utilisant l'oauth`,
    },
    logs: {
      baseMenu: [
        {
          value: "message",
          label: "Message",
        },
        {
          value: "moderation",
          label: "Moderation",
        },
        {
          value: "antiraid",
          label: "Antiraid",
        },
        {
          value: "voice",
          label: "Vocal",
        },
      ],
      question: "Quel est le salon ?",
      notText: `Le channel doit être est un channel textuel`,
      // success: (logs, channel) => `Vous avez définie les logs **${logs}** sur ${channel}`,
      template: {
        message: {
          link: (executor, channel, link) => {
            return {
              description: `${executor.toString()} a posté un lien dans ${channel}\n\nContent: ${link}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          mention: (executor, channel, mention) => {
            return {
              description: `${executor.toString()} a posté trop de mention dans ${channel}\n\nContent: ${mention}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          delete: (executor, target, channel, content) => {
            return {
              description: `${executor.toString()} a supprimé ${
                target
                  ? `le message de ${target.toString()}`
                  : `son propre message`
              } dans ${channel}\n\nContent: ${content}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}${
                    target ? `\nTarget = ${target.id}` : ""
                  }\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          update: (executor, channel, oldContent, newContent, link) => {
            return {
              description: `${executor.toString()} a modifié son message dans ${channel}\n[Go to message](${link})\noldContent: ${oldContent}\nnewContent: ${newContent}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
        },
        channel: {
          create: (executor, channel) => {
            return {
              description: `${executor.toString()} a créé le salon ${channel.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          update: (executor, oldChannel, newChannel) => {
            return {
              description: `${executor.toString()} a modifié le salon ${oldChannel.toString()} en ${newChannel.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${newChannel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          delete: (executor, channel) => {
            return {
              description: `${executor.toString()} a supprimé le salon **${
                channel.name
              }**`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          webhook: (executor, channel) => {
            return {
              description: `${executor.toString()} a créé un webhook dans **${
                channel.name
              }**`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
        },
        role: {
          create: (executor, role) => {
            return {
              description: `${executor.toString()} a créé le role ${role.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nRole = ${role.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          update: (executor, oldRole, newRole) => {
            return {
              description: `${executor.toString()} a modifié le role ${oldRole.toString()} en ${newRole.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nRole = ${oldRole.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          delete: (executor, role) => {
            return {
              description: `${executor.toString()} a supprimé le role **${
                role.name
              }**`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nRole = ${role.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          add: (executor, target, role) => {
            return {
              description: `${executor.toString()} ${
                executor.id === target.id
                  ? `s'est ajouté le role ${role.toString()}`
                  : `a ajouté le rôle ${role.toString()} à ${target.toString()}`
              }`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}${
                    target.id !== executor.id ? `\nTarget = ${target.id}` : ""
                  }\nRole = ${role.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          remove: (executor, target, role) => {
            return {
              description: `${executor.toString()} ${
                executor.id === target.id
                  ? `s'est supprimé le role ${role.toString()}`
                  : `a supprimé le rôle ${role.toString()} à ${target.toString()}`
              }`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}${
                    target.id !== executor.id ? `\nTarget = ${target.id}` : ""
                  }\nRole = ${role.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
        },
        guild: {
          blacklist: (blacklisted) => {
            return {
              description: `${blacklisted.toString()} a essayé de rejoindre en étant blacklist`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${blacklisted.id}\`\`\``,
                },
              ],
              author: {
                name: `${blacklisted.username}#${blacklisted.discriminator}`,
                icon_url: blacklisted.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },

          ban: (executor, target, reason) => {
            return {
              description: `${executor.toString()} a banni ${target.toString()} pour **${reason}**`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          antiDc: (user, time, limit) => {
            return {
              description: `${user.toString()} a créé son compte trop récemment (${time}). La limite sur le serveur est de ${limit}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nMember = ${user.id}\`\`\``,
                },
              ],
              author: {
                name: `${user.username}#${user.discriminator}`,
                icon_url: user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          unban: (executor, target) => {
            return {
              description: `${executor.toString()} a debanni ${target.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          kick: (executor, target) => {
            return {
              description: `${executor.toString()} a exclu ${target.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          bot: (executor, bot) => {
            return {
              description: `${executor.toString()} a ajouté le bot ${bot.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${bot.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          name: (executor, oldName, newName) => {
            return {
              description: `${executor.toString()} a modifié le nom du serveur de: **${oldName}** à **${newName}**`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\noldName = ${oldName}\nnewName = ${newName}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          vanity: (executor, oldVanity, newVanity) => {
            return {
              description: `${executor.toString()} a modifié l'url du serveur de: **${oldVanity}** à **${newVanity}**`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\noldVanity = ${oldVanity}\nnewVanity = ${newVanity}\`\`\``,
                },
              ],
              author: {
                name: `${executor.username}#${executor.discriminator}`,
                icon_url: executor.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
        },
        limit: {
          token: (member, limit) => {
            return {
              description: `${member.toString()} a été expulsé car trop de personne on rejoins en peu de temps \`(${limit})\``,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${member.id}\nLimit = ${limit}\`\`\``,
                },
              ],
              author: {
                name: `${member.user.username}#${member.user.discriminator}`,
                icon_url: member.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          spam: (member) => {
            return {
              description: `${member.toString()} a envoyé des messages trop rapidement`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${member.id}\`\``,
                },
              ],
              author: {
                name: `${member.user.username}#${member.user.discriminator}`,
                icon_url: member.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
        },
        voice: {
          connect: (executor, channel) => {
            return {
              description: `${executor.toString()} s'est connecté dans le salon ${channel.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          unmute: (executor, target, channel, type) => {
            return {
              description: `${executor.toString()} ${
                executor.id === target.id
                  ? `s'est unmute (${type})`
                  : `a unmute (${type}) ${target.toString()}`
              } dans le salon ${channel.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\n${
                    executor.id === target.id ? "" : `Target = ${target.id}`
                  }\nChannel = ${channel.id}\nType = ${type}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          mute: (executor, target, channel, type) => {
            return {
              description: `${executor.toString()} ${
                executor.id === target.id
                  ? `s'est mute (${type})`
                  : `a mute (${type}) ${target.toString()}`
              } dans le salon ${channel.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\n${
                    executor.id === target.id ? "" : `Target = ${target.id}`
                  }\nChannel = ${channel.id}\nType = ${type}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          move: (executor, target, oldChannel, newChannel) => {
            return {
              description: `${executor.toString()} ${
                executor.id === target.id
                  ? `s'est déplacé`
                  : `a déplacé ${target.toString()}`
              } du salon ${oldChannel.toString()} au salon ${newChannel.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\n${
                    executor.id === target.id ? "" : `Target = ${target.id}`
                  }\n oldChannel = ${oldChannel.id} \n newChannel = ${
                    newChannel.id
                  }\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
          disconnect: (executor, target, channel) => {
            return {
              description: `${executor.toString()} ${
                executor.id === target.id
                  ? `s'est déconnecté`
                  : `a déconnecté ${target.toString()}`
              } du salon ${channel.toString()}`,
              fields: [
                {
                  name: "ID:",
                  value: `\`\`\`js\nExecutor = ${executor.id}\n${
                    executor.id === target.id ? "" : `Target = ${target.id}`
                  }\nChannel = ${channel.id}\`\`\``,
                },
              ],
              author: {
                name: `${executor.user.username}#${executor.user.discriminator}`,
                icon_url: executor.user.displayAvatarURL({ dynamic: true }),
              },
              timestamp: new Date(),
              footer: {
                text: "🕙",
              },
              color: "#36393E",
            };
          },
        },
      },
    },
  },
};

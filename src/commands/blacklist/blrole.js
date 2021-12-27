const { Message, Collection } = require("discord.js");
const OneForAll = require("../../structures/OneForAll");
module.exports = {
  name: "blacklist-role",
  aliases: ["blrole"],
  description:
    "Blacklist a role from being added | Blacklist un role d'être ajouté",
  usage: "blrole <add/remove/list/clear> [role] [reason]",
  clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  ofaPerms: ["BLACKLIST_CMD"],
  cooldown: 1500,
  /**
   *
   * @param {OneForAll} oneforall
   * @param {Message} message
   * @param {Collection} memberData
   * @param {Collection} guildData
   * @param {[]} args
   */
  run: async (oneforall, message, guildData, memberData, args) => {
    const lang = guildData.langManager;
    const subCommand = args[0];
    if(subCommand === 'clear'){
      guildData.blacklistRoles = [];
      guildData.save().then(() => {
        message.channel.send(lang.blacklist.role.successClear)
      })
    }
    if (subCommand === "add") {
      const targetRole =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]);
      if (!targetRole)
        return oneforall.functions.tempMessage(message, lang.invalidRole);
      const alreadyBlacklisted = guildData.blacklistRoles.includes(
        targetRole.id
      );
      const reason =
        args.slice(2).join(" ") ||
        `Blacklisted role by ${message.author.username}#${message.author.discriminator}`;
      if (alreadyBlacklisted)
        return oneforall.functions.tempMessage(
          message,
          lang.blacklist.role.alreadyBlacklist(targetRole.name)
        );

      guildData.blacklistRoles.push(targetRole.id);
      guildData.save().then(() => {
        message.channel.send(lang.blacklist.role.successAdd(targetRole.name, reason));
      });
    }
    if (subCommand === "remove") {
      const targetRole =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]);
      if (!targetRole)
        return oneforall.functions.tempMessage(message, lang.invalidRole);
      const alreadyBlacklisted = guildData.blacklistRoles.includes(
        targetRole.id
      );

      if (!alreadyBlacklisted)
        return oneforall.functions.tempMessage(
          message,
          lang.blacklist.role.notBlacklist(targetRole.name)
        );

      guildData.blacklistRoles = guildData.blacklistRoles.filter(
        (role) => role !== targetRole.id
      );
      guildData.save().then(() => {
        message.channel.send(
          lang.blacklist.role.successRemove(targetRole.name)
        );
      });
    }
    if (subCommand === "list") {
      const blacklistRoles = guildData.blacklistRoles;
      const embedChange = (
        page,
        slicerIndicatorMin,
        slicerIndicatorMax,
        totalPage
      ) => {
        return {
          ...oneforall.embed(guildData),
          title: `All blacklisted roles (${blacklistRoles.length})`,
          footer: {
            text: `Page ${page + 1}/${totalPage || 1}`,
          },
          description:
            blacklistRoles
              .map((bl, i) => {
                return `\`${i+1}\` ・ <@&${bl}> \`(${bl})\``;
              })
              .slice(slicerIndicatorMin, slicerIndicatorMax)
              .join("\n") || "No data",
        };
      };
      await new oneforall.DataMenu(
        blacklistRoles,
        embedChange,
        message,
        oneforall
      ).sendEmbed();
    }
  },
};

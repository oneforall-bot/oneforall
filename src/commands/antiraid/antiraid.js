const {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");

const { Message, Collection } = require("discord.js");
const OneForAll = require("../../structures/OneForAll");
module.exports = {
  name: "antiraid",
  aliases: [],
  description: "Configure the antiraid | Configurer l'antiraid",
  usage: "antiraid <config/on/off/opti>",
  clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  ofaPerms: ["ANTIRAID_CMD"],
  guildOwnersOnly: false,
  guildCrownOnly: false,
  ownersOnly: false,
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
    const lang = guildData.langManager;
    const subCommand = args[0];
    if (subCommand === "on" || subCommand === "off") {
      for (const feature of Object.keys(guildData.antiraid.enable))
        guildData.antiraid.enable[feature] = subCommand === "on";
      return guildData.save().then(() => {
        oneforall.functions.tempMessage(
          message,
          lang.antiraid.enable.all(subCommand)
        );
      });
    }

    if (subCommand === "config") {
      let page = 0,
        slicerIndicatorMin = 0,
        slicerIndicatorMax = 10,
        maxPerPage = 10,
        totalPage = Math.ceil(
          Object.keys(guildData.antiraid.config).length / maxPerPage
        );
      const components = () => {
        return [
          new MessageButton()
            .setCustomId(`antiraid.left.${message.id}`)
            .setEmoji("◀️")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId(`antiraid.right.${message.id}`)
            .setEmoji("▶️")
            .setStyle("SECONDARY"),
          new MessageSelectMenu()
            .setOptions(
              Object.keys(guildData.antiraid.config)
                .slice(slicerIndicatorMin, slicerIndicatorMax)
                .map((feature) => {
                  return {
                    value: feature,
                    label: feature,
                  };
                })
            )
            .setCustomId(`antiraid.config.${message.id}`),
          new MessageButton()
            .setCustomId(`antiraid.save.${message.id}`)
            .setEmoji("✅")
            .setStyle("SUCCESS"),
        ];
      };

      const componentFilter = {
          filter: (interaction) =>
            interaction.customId.includes(`antiraid`) &&
            interaction.customId.includes(message.id) &&
            interaction.user.id === message.author.id,
          time: 900000,
        },
        awaitMessageFilter = {
          filter: (response) => response.author.id === message.author.id,
          time: 900000,
          limit: 1,
          max: 1,
          errors: ["time"],
        };
      const tempConfig = { ...guildData.antiraid };
      const { config, enable, limit, channelBypass } = tempConfig;

      const fields = () => {
        const tempFields = [];
        for (
          let i = 0;
          i < Object.entries(guildData.antiraid.config).length;
          i++
        ) {
          const configArray = Object.entries(config)[i];
          const enableArray = Object.entries(enable).find(
            (feature) => feature[0] === configArray[0]
          );
          const limitArray = Object.entries(limit).find(
            (feature) => feature[0] === configArray[0]
          );
          const channelBypassArray = Object.entries(channelBypass).find(
            (feature) => feature[0] === configArray[0]
          );
          if (enableArray && configArray)
            tempFields.push({
              name: `${i + 1} ・ ${configArray[0]}:`,
              value: `Actif: \`${enableArray[1] ? "✅" : "❌"}\`\nSanction: \`${
                configArray[1]
              }\`\n${
                limitArray ? `Limit: \`${limitArray[1]}\n\`` : ""
              }Channel bypass: ${
                channelBypassArray[1].length
                  ? `\`${channelBypassArray[1]
                      .map((ch) => `\`<#${ch}>\``)
                      .join(", ")}\``
                  : "`N/A`"
              }`,
            });
        }
        return tempFields;
      };

      const embed = {
        timestamp: new Date(),
        color: guildData.embedColor,
        fields: fields().slice(0, maxPerPage),
        title: `Antiraid Config (${
          Object.keys(guildData.antiraid.config).length
        })`,
        footer: {
          text: `Antiraid Config ・ Page 1/${totalPage}`,
          icon_url: message.author.displayAvatarURL({ dynamic: true }) || "",
        },
      };
      const panel = await message.channel.send({
        embeds: [embed],
        components: components().map(
          (c) => new MessageActionRow({ components: [c] })
        ),
      });

      const embedPageChanger = (page) => {
        embed.fields = fields().slice(slicerIndicatorMin, slicerIndicatorMax);
        embed.footer.text = `Antiraid Config ・ Page ${
          page + 1
        } / ${totalPage}`;
        return embed;
      };
      let selectFeature;
      const collector =
        message.channel.createMessageComponentCollector(componentFilter);
      collector.on("collect", async (interaction) => {
        await interaction.deferUpdate();

        if (interaction.componentType === "BUTTON") {
          const selectedButton = interaction.customId.split(".")[1];
          if (selectedButton === "left") {
            page =
              page === 0
                ? (page = totalPage - 1)
                : page <= totalPage - 1
                ? (page -= 1)
                : (page += 1);
            slicerIndicatorMin -= maxPerPage;
            slicerIndicatorMax -= maxPerPage;
          }
          if (selectedButton === "right") {
            page = page !== totalPage - 1 ? (page += 1) : (page = 0);
            slicerIndicatorMin += maxPerPage;
            slicerIndicatorMax += maxPerPage;
          }
          if (selectedButton === "save") {
            return collector.stop("save");
          }
          if (slicerIndicatorMax < 0 || slicerIndicatorMin < 0) {
            slicerIndicatorMin += maxPerPage * totalPage;
            slicerIndicatorMax += maxPerPage * totalPage;
          } else if (
            (slicerIndicatorMax >= maxPerPage * totalPage ||
              slicerIndicatorMin >= maxPerPage * totalPage) &&
            page === 0
          ) {
            slicerIndicatorMin = 0;
            slicerIndicatorMax = maxPerPage;
          }
        } else {
          const selectOption = interaction.values[0];
          if (selectOption in config) selectFeature = selectOption;
          const isLimit = (selectFeature || selectOption) in limit;
          const component = components();
          component[2].setOptions(
            lang.antiraid.config.configMenu(enable[selectOption], isLimit)
          );

          if (selectFeature) {
            if (selectOption === "enable") {
              enable[selectFeature] = !enable[selectFeature];
            }
            if (selectOption === "back") {
              const isSelectChannel = interaction.component.options.find(
                (opts) => opts.value === "add"
              );

              return await panel.edit({
                embeds: [embedPageChanger(page)],
                components: (isSelectChannel ? component : components()).map(
                  (c) => new MessageActionRow({ components: [c] })
                ),
              });
            }

            if (selectOption === "channelBypass") {
              const selectMenu = lang.antiraid.config
                .configMenu(enable[selectFeature], isLimit)
                .find((opts) => opts.value === selectOption);
              component[2].setOptions(selectMenu.subMenu);
            }
            if (selectOption === "limit") {
              const selectMenu = lang.antiraid.config
                .configMenu(enable[selectFeature], isLimit)
                .find((opts) => opts.value === selectOption);
              const questionAnswer = await generateQuestion(
                selectMenu.question
              );
              if (
                selectFeature === "antiMassBan" ||
                selectFeature === "antiMassKick" ||
                selectFeature === "antiLink" ||
                selectFeature === "antiToken" ||
                selectFeature === "antiMassMention"
              ) {
                if (
                  !oneforall.functions.isValidTime(questionAnswer.content, true)
                ) {
                  return oneforall.functions.tempMessage(
                    message,
                    lang.antiraid.limit.errorNotNumber
                  );
                }
              }
              if (selectFeature === "antiDc") {
                if (!oneforall.functions.isValidTime(questionAnswer.content)) {
                  return oneforall.functions.tempMessage(
                    message,
                    lang.antiraid.limit.errorAntiDc
                  );
                }
              }
              limit[selectFeature] = questionAnswer.content;
            }
            if (selectOption === "sanction") {
              const selectMenu = lang.antiraid.config
                .configMenu(enable[selectFeature], isLimit)
                .find((opts) => opts.value === selectOption);
              const questionAnswer = await generateQuestion(
                selectMenu.question
              );
              if (
                questionAnswer.content !== "mute" &&
                questionAnswer.content !== "unrank" &&
                questionAnswer.content !== "kick" &&
                questionAnswer.content !== "ban"
              )
                return oneforall.functions.tempMessage(
                  message,
                  lang.antiraid.config.wrongSanctionType
                );
              config[selectFeature] = questionAnswer.content;
            }
            if (selectOption === "add" || selectOption === "remove") {
              const selectMenu = lang.antiraid.config
                .configMenu(enable[selectFeature], isLimit)
                .find((opts) => opts.value === "channelBypass");
              const subMenu = selectMenu.subMenu.find(
                (opts) => opts.value === selectOption
              );
              const questionAnswer = await generateQuestion(subMenu.question);
              const givenChannels = questionAnswer.content.split(",").filter(ch => message.guild.channels.cache.has(ch.startsWith("<#") && ch.endsWith(">") ? ch.replace(/#/, '').slice(1, -1) : ch)).map((ch) => ch.startsWith("<#") && ch.endsWith(">") ? ch.replace(/#/, '').slice(1, -1) : ch);
              console.log(givenChannels);
              const channels = givenChannels.filter(ch => message.guild.channels.cache.get(ch)?.isText() || undefined)
              console.log(channels);
            }
          }
          return await panel.edit({
            embeds: [embedPageChanger(page)],
            components: component.map(
              (c) => new MessageActionRow({ components: [c] })
            ),
          });
        }
        await panel.edit({
          embeds: [embedPageChanger(page)],
          components: components().map(
            (c) => new MessageActionRow({ components: [c] })
          ),
        });
      });
      collector.on("end", (_, reason) => {
        if (reason === "save") {
          guildData.antiraid = tempConfig;
          guildData.save().then(() => {
            panel.delete();
            oneforall.functions.tempMessage(message, lang.save);
          });
        }
      });
      async function generateQuestion(question) {
        const messageQuestion = await message.channel.send(question);

        const collected = await messageQuestion.channel.awaitMessages(
          awaitMessageFilter
        );
        await messageQuestion.delete();
        await collected.first().delete();
        return collected.first();
      }
    }
  },
};

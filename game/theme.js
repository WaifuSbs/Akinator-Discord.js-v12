const Discord = require("discord.js");
const i18n = require("i18n");
const config = require("../config.json");
const game_handler = require("./handler");

module.exports = {
    getTheme: (client, message, args, lang, theme, ans_mode, child_mode) => {
        var game_region;
        var chose_theme;
        i18n.setLocale(lang);
        switch (lang) {
            case "en":
                if (theme == "character" || theme == "char" || theme == "person") {
                    game_region = "en";
                    chose_theme = i18n.__("theme.character");
                    game_handler.run(client, message, lang, chose_theme, game_region, ans_mode, child_mode);
                } else if (theme == "object" || theme == "stuff") {
                    game_region = "en_objects";
                    chose_theme = i18n.__("theme.object");
                    game_handler.run(client, message, lang, chose_theme, game_region, ans_mode, child_mode);
                } else if (theme == "animal" || theme == "cat") {
                    game_region = "en_animals";
                    chose_theme = i18n.__("theme.animal");
                    game_handler.run(client, message, lang, chose_theme, game_region, ans_mode, child_mode);
                } else {
                    unknown_theme();
                }
                break;
            case "fr":
                if (theme == "character" || theme == "char" || theme == "person") {
                    game_region = "fr";
                    chose_theme = i18n.__("theme.character");
                    game_handler.run(client, message, lang, chose_theme, game_region, ans_mode, child_mode);
                } else if (theme == "object" || theme == "stuff") {
                    game_region = "fr_objects";
                    chose_theme = i18n.__("theme.object");
                    game_handler.run(client, message, lang, chose_theme, game_region, ans_mode, child_mode);
                } else if (theme == "animal" || theme == "cat") {
                    game_region = "fr_animals";
                    chose_theme = i18n.__("theme.animal");
                    game_handler.run(client, message, lang, chose_theme, game_region, ans_mode, child_mode);
                } else {
                    unknown_theme();
                }
                break;
        }

        function unknown_theme() {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor("Akinator")
                .setDescription(i18n.__("theme.unknown").replace("%theme%", theme))
            message.channel.send(embed);
        }
    },

    chooseTheme: (client, message, args, lang, ans_mode, child_mode) => {
        i18n.setLocale(lang);
        var lang_case;
        const embed = new Discord.MessageEmbed()
            .setColor(config.main_color)
            .setTitle(i18n.__("theme.translate"))
            .setDescription(i18n.__("theme.description"))
        switch (lang) {
            case "en":
            case "fr":
                embed.addField(i18n.__("theme.instruction"), `🕵️ **${i18n.__("theme.character")}**\n❔ **${i18n.__("theme.object")}**\n😺 **${i18n.__("theme.animal")}**`)
                lang_case = 1; // 3 modes: Character, Object and Animal
                break;
            case "de":
            case "es":
            case "it":
            case "jp":
                embed.addField(i18n.__("theme.instruction"), `🕵️ **${i18n.__("theme.character")}**\n😺 **${i18n.__("theme.animal")}**`)
                lang_case = 2; // 2 modes: Character and Animal
                break;
            default:
                lang_case = 3; // Only Character
                embed.addField(i18n.__("theme.instruction"), `🕵️ **${i18n.__("theme.character")}**`)
        }
        embed.setFooter(i18n.__("game.startup.footer").replace("%player%", message.author.tag));
        message.channel.send(embed).then(async rep => {
            if (lang_case == 1) {
                await rep.react("🕵️");
                await rep.react("❔");
                await rep.react("😺");
            }
            if (lang_case == 2) {
                await rep.react("🕵️");
                await rep.react("😺");
            }
            if (lang_case == 3) {
                await rep.react("🕵️");
            }

            const filter = (reaction, user) => user.id != client.user.id && user.id == message.author.id;
            var collector = rep.createReactionCollector(filter, { time: 15000 });
            var rec = "no";
            collector.on("collect", async(reaction, user) => {
                if (reaction.emoji.name == "🕵️") {
                    rep.delete().catch();
                    rec = "yes";
                    var theme = "character";
                    module.exports.getTheme(client, message, args, lang, theme, ans_mode, child_mode);
                    collector.stop();
                }
                if (reaction.emoji.name == "❔") {
                    if (!lang_case == 1) return;
                    rep.delete().catch();
                    rec = "yes";
                    var theme = "object";
                    module.exports.getTheme(client, message, args, lang, theme, ans_mode, child_mode);
                    collector.stop();
                }
                if (reaction.emoji.name == "😺") {
                    if (!lang_case == 3) return;
                    rep.delete().catch();
                    rec = "yes";
                    var theme = "animal";
                    module.exports.getTheme(client, message, args, lang, theme, ans_mode, child_mode);
                    collector.stop();
                }
            })

            collector.on("end", async() => {
                if (rec == "no") {
                    rep.delete().catch();
                    const embed = new Discord.MessageEmbed()
                        .setColor(config.main_color)
                        .setAuthor(`Akinator`)
                        .setDescription(i18n.__("theme.aborted"))
                        .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                    message.channel.send(embed);
                } else return;
            })
        })
    }
}
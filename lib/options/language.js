const Discord = require("discord.js");
const i18n = require("i18n");
const config = require("../../config.json");
const con = require("../../lib/sql");

module.exports = {
    run: async(client, message, args, lang, result) => {
        i18n.setLocale(lang);
        i18n.removeLocale("vi-VN");
        if (!args[1]) {
            var array = [];
            var lang_array = i18n.getLocales();
            lang_array.forEach(async(lang) => {
                var lang_desc = require("../../lib/lang").getLang(lang);
                array.push(lang_desc + " `" + lang + "`");
            })
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(i18n.__("option.name") + " >> " + i18n.__("option.language"))
                .addField(i18n.__("option.opt_lang_desc").replace("%prefix%", config.prefix), i18n.__("option.opt_lang_cur") + " " + require("../../lib/lang").getLang(lang))
                .addField(i18n.__("option.opt_lang_available").replace("%language_count%", array.length), array.join("\n"))
                .setFooter(i18n.__("option.cur_user").replace("%user%", message.author.tag))
            message.channel.send(embed);
        } else {
            var selected_lang = args[1].toLowerCase();
            var lang_desc = require("../../lib/lang").getLang(selected_lang);
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(i18n.__("option.name") + " >> " + i18n.__("option.language"))
                .setFooter(i18n.__("option.cur_user").replace("%user%", message.author.tag))
            if (lang_desc == "unknown") {
                embed.setDescription(i18n.__("option.opt_lang_unknown"))
                message.channel.send(embed);
            } else {
                if (selected_lang == lang) {
                    embed.setDescription(i18n.__("option.opt_lang_already").replace("%language%", lang_desc));
                    message.channel.send(embed);
                    return;
                }
                var change_lang;
                if (selected_lang == "zh_cn") { change_lang = "cn" } else { change_lang = selected_lang };
                con.query("UPDATE users SET language = '" + change_lang + "' WHERE userId = '" + message.author.id + "'", function(err, result) {
                    if (err) return message.channel.send("Something went wrong with database! Please try again.");
                    i18n.setLocale(selected_lang);
                    embed.setDescription(i18n.__("option.opt_lang_changed_suc").replace("%language%", lang_desc).replace("%language_code%", selected_lang));
                    message.channel.send(embed);
                })
            }
        }
    }
}
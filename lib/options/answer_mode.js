const Discord = require("discord.js");
const i18n = require("i18n");
const config = require("../../config.json");
const con = require("../../lib/sql");

module.exports = {
    run: async(client, message, args, lang, result) => {
        i18n.setLocale(lang);
        if (!args[1]) {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(i18n.__("option.name") + " >> " + i18n.__("option.ans_mode"))
                .addField(i18n.__("option.opt_ans_desc").replace("%prefix%", config.prefix), i18n.__("option.opt_ans_cur") + " " + result[0].answer_mode)
                .addField(i18n.__("option.opt_ans_available").replace("%ans_mode_count%", "2"), "**1**. Reaction \n**2**. Chat")
                .setFooter(i18n.__("option.cur_user").replace("%user%", message.author.tag))
            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(i18n.__("option.name") + " >> " + i18n.__("option.ans_mode"))
                .setFooter(i18n.__("option.cur_user").replace("%user%", message.author.tag))
            if (args[1].toLowerCase() == "reaction") {
                if (result[0].answer_mode == "reaction") {
                    embed.setDescription(i18n.__("option.opt_ans_already").replace("%ans_mode%", "**Reaction**"));
                    message.channel.send(embed);
                } else {
                    con.query("UPDATE users SET answer_mode = 'reaction' WHERE userId = '" + message.author.id + "'", function(err, result) {
                        if (err) return message.channel.send("Something went wrong with database! Please try again.");
                        embed.setDescription(i18n.__("option.opt_ans_changed_suc").replace("%ans_mode%", "**Reaction**"));
                        message.channel.send(embed);
                    })
                }
            } else if (args[1].toLowerCase() == "chat") {
                if (result[0].answer_mode == "chat") {
                    embed.setDescription(i18n.__("option.opt_ans_already").replace("%ans_mode%", "**Chat**"));
                    message.channel.send(embed);
                } else {
                    con.query("UPDATE users SET answer_mode = 'chat' WHERE userId = '" + message.author.id + "'", function(err, result) {
                        if (err) return message.channel.send("Something went wrong with database! Please try again.");
                        embed.setDescription(i18n.__("option.opt_ans_changed_suc").replace("%ans_mode%", "**Chat**"));
                        message.channel.send(embed);
                    })
                }
            } else {
                embed.setDescription(i18n.__("option.opt_ans_unknown"));
                message.channel.send(embed);
            }
        }
    }
}
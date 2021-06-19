const Discord = require("discord.js");
const i18n = require("i18n");
const config = require("../../config.json");
const con = require("../../lib/sql");

module.exports = {
    run: async(client, message, args, lang, result) => {
        i18n.setLocale(lang);
        var cm_status = cmStatus(result[0].child_mode);
        if (!args[1]) {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(i18n.__("option.name") + " >> " + i18n.__("option.child_mode"))
                .addField(i18n.__("option.opt_chm_desc").replace("%prefix%", config.prefix), i18n.__("option.opt_chm_cur") + " **" + cm_status + "**")
                .addField(i18n.__("option.opt_chm_available"), "**1**. True \n**2**. False")
                .setFooter(i18n.__("option.cur_user").replace("%user%", message.author.tag))
            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(i18n.__("option.name") + " >> " + i18n.__("option.child_mode"))
                .setFooter(i18n.__("option.cur_user").replace("%user%", message.author.tag))
            if (args[1].toLowerCase() == "true") {
                if (result[0].child_mode == "true") {
                    embed.setDescription(i18n.__("option.opt_chm_already").replace("%child_mode_status%", cm_status));
                    message.channel.send(embed);
                } else {
                    con.query("UPDATE users SET child_mode = 'true' WHERE userId = '" + message.author.id + "'", function(err, result) {
                        if (err) return message.channel.send("Something went wrong with database! Please try again.");
                        embed.setDescription(i18n.__("option.opt_chm_changed_suc").replace("%child_mode_status%", cmStatus(args[1].toLowerCase())));
                        message.channel.send(embed);
                    })
                }
            } else if (args[1].toLowerCase() == "false") {
                if (result[0].child_mode == "false") {
                    embed.setDescription(i18n.__("option.opt_chm_already").replace("%child_mode_status%", cm_status));
                    message.channel.send(embed);
                } else {
                    con.query("UPDATE users SET child_mode = 'false' WHERE userId = '" + message.author.id + "'", function(err, result) {
                        if (err) return message.channel.send("Something went wrong with database! Please try again.");
                        embed.setDescription(i18n.__("option.opt_chm_changed_suc").replace("%child_mode_status%", cmStatus(args[1].toLowerCase())));
                        message.channel.send(embed);
                    })
                }
            } else {
                embed.setDescription(i18n.__("option.opt_chm_unknown"));
                message.channel.send(embed);
            }
        }

        function cmStatus(status) {
            if (status == "true") return "Enabled";
            if (status == "false") return "Disabled";
        }
    }
}
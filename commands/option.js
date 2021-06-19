module.exports.config = {
    name: "option",
    aliases: ["setting", "preference"],
    argument: "option [ option ]"
}

const Discord = require("discord.js");
const i18n = require("i18n");
const config = require("../config.json");

module.exports.run = async(client, message, args, lang, result) => {
    i18n.setLocale(lang);
    if (!args[0]) {
        var language = require("../lib/lang").getLang(lang);
        const embed = new Discord.MessageEmbed()
            .setColor(config.main_color)
            .setTitle(i18n.__("option.name"))
            .setDescription(i18n.__("option.description").replace("%prefix%", config.prefix))
            .addField(i18n.__("option.language") + " `lang`", language)
            .addField(i18n.__("option.ans_mode") + " `answer`", result[0].answer_mode)
            .addField(i18n.__("option.child_mode") + " `child`", childMode(result[0].child_mode))
            .setFooter(i18n.__("option.cur_user").replace("%user%", message.author.tag))
        message.channel.send(embed);
    } else {
        if (args[0].toLowerCase() == "language" || args[0].toLowerCase() == "lang") {
            const lib = require("../lib/options/language");
            lib.run(client, message, args, lang, result);
        } else if (args[0].toLowerCase() == "answer" || args[0].toLowerCase() == "answertype") {
            const lib = require("../lib/options/answer_mode");
            lib.run(client, message, args, lang, result);
        } else if (args[0].toLowerCase() == "child" || args[0].toLowerCase() == "childmode") {
            const lib = require("../lib/options/child_mode");
            lib.run(client, message, args, lang, result);
        }
    }

    function childMode(mode) {
        var desc;
        switch (mode) {
            case "false":
                desc = ":red_square: Disabled"
                break;
            case "true":
                desc = ":green_square: Enabled"
                break;
        }
        return desc;
    }
}
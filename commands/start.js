const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const i18n = require("i18n");

module.exports.config = {
    name: "start",
    aliases: [],
    argument: "start [ blank | theme ]"
}

module.exports.run = async(client, message, args, lang, result) => {
    // if (err) return message.channel.send("Something went wrong while fetching Database!");

    var ans_mode = result[0].answer_mode;
    var child_mode = result[0].child_mode;

    const themeHandler = require("../game/theme");
    if (!args[0]) {
        themeHandler.chooseTheme(client, message, args, lang, ans_mode, child_mode);
    } else {
        var theme = args[0];
        themeHandler.getTheme(client, message, args, lang, theme, ans_mode, child_mode);
    }
}

module.exports.desc = (lang) => {
    i18n.setLocale(lang);
    var desc = i18n.__("command.start.description");
    return desc;
}
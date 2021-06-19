module.exports.config = {
    name: "credit",
    aliases: [],
    argument: "credit"
}

const Discord = require("discord.js");
const config = require("../config.json");
const i18n = require("i18n");

module.exports.run = async(client, message, args, lang) => {
    i18n.setLocale(lang);
    message.channel.send("not available");
}
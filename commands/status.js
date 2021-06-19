module.exports.config = {
    name: "status",
    aliases: [],
    argument: "status"
}

const i18n = require("i18n");

module.exports.run = async(client, message, args, lang, result) => {
    i18n.setLocale(lang);
    message.channel.send("Not available.");
}
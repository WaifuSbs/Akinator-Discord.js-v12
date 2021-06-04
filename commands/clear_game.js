module.exports.config = {
    name: "clear",
    aliases: ["cleargame", "releasechannel", "release"],
    argument: "clear"
}

const i18n = require("i18n");
module.exports.run = async(client, message, args, lang) => {
    // i18n.setLocale(lang);

    // const game = require("../game/game_react")
    // Break game on Game error
    message.channel.send("Command not available!");
}
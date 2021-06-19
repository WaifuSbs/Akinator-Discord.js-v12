module.exports.config = {
    name: "info",
    aliases: ["botinfo"],
    argument: "info"
}

const Discord = require("discord.js");
const i18n = require("i18n");
const config = require("../config.json");
const package = require("../package.json");

module.exports.run = async(client, message, args, lang) => {
    i18n.setLocale(lang);
    const embed = new Discord.MessageEmbed()
        .setColor(config.main_color)
        .setTitle("Akinator")
        .setDescription(i18n.__("info.description"))
        .addField(i18n.__("info.version"), package.version, true)
        .addField(i18n.__("info.library"), "[Discord.js](https://discord.js.org)\n[aki-api](https://github.com/jgoralcz/aki-api) (API Wrapper)", true)
        .addField(i18n.__("info.website"), "[aki.weebs.life](https://aki.weebs.life)\n[Akinator](https://akinator.com)", true)
        .addField(i18n.__("info.creator"), "TheLT#0100 - Discord Bot\nElokence - Akinator Game", true)
        .addField(i18n.__("info.bot"), `[${i18n.__("info.invite")}](https://aki.weebs.life/invite)`, true)
    message.channel.send(embed);
}
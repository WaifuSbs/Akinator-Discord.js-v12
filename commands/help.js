module.exports.config = {
    name: "help",
    aliases: [],
    argument: "help"
}

const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const i18n = require("i18n");

module.exports.run = async(client, message, args, lang) => {
    i18n.setLocale(lang);
    const embed = new Discord.MessageEmbed()
        .setColor(config.main_color)
        .setTitle(i18n.__("help.name"))
        .setDescription(i18n.__("help.description"))
    var commands = client.commands.array();
    commands.forEach(async(cmd) => {
        var aliases;
        if (cmd.config.aliases.length == 0) { aliases = `*none*` } else { aliases = '`' + cmd.config.aliases + '`' };
        var command_desc = require(`../lib/help`);
        var desc = command_desc.getCommandDesc(lang, cmd.config.name);
        embed.addField(cmd.config.name + ' `' + prefix + cmd.config.argument + '`', `**>** ${desc}\n**>** ${i18n.__("command.aliases")}: ${aliases}`);
    });
    message.channel.send(embed);
}
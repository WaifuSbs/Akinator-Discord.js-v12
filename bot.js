const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;

// === // 

const fs = require("fs");
const path = require("path");
const i18n = require("i18n");

// Command Handler

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        return console.log("[!] => Couldn't load commands since there is no commands files to load!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name.toLowerCase(), pull);
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name);
        });
    });

    console.log(`=> Command: Loaded ${jsfile.length} commands.`);
});

// i18n - Languages

i18n.configure({
    locales: ["en", "ar", "zh_cn", "de", "es", "fr", "il", "it", "jp", "kr", "nl", "pl", "pt", "ru", "tr", "id", "vi-VN"],
    directory: path.join(__dirname, "locales"),
    defaultLocale: "en",
    objectNotation: true,
    register: global,

    logWarnFn: function(msg) {
        console.log("=> WARN: ", msg);
    },

    logErrorFn: function(msg) {
        console.log("=> Error: ", msg);
    },

    missingKeyFn: function(locale, value) {
        return value;
    },

    mustacheConfig: {
        tags: ["{{", "}}"],
        disable: false
    }
});


// Check connection to database

const con = require('./lib/sql.js');
con.getConnection(function(err, connection) {
    if (!err) {
        console.log("=> SQL: Connected to the database!");
        connection.release();
    } else {
        console.log("=> SQL: Error while connecting to database! Please shutdown process to reconfig the database or the bot will not work!");
    }
})

// Client

client.on('ready', async() => {
    console.log(`=> Logged as ${client.user.tag}`)
})

client.on('message', async message => {

    // Command Executor if the message starts with prefix
    if (message.content.startsWith(prefix)) {
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        let command = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
        var lang;

        if (command) {
            con.query("SELECT * FROM users WHERE userId = '" + message.author.id + "'", function(err, result) {
                if (result[0] == null) {
                    const import_user = require("./lib/user");
                    const embed = new Discord.MessageEmbed()
                        .setColor(config.main_color)
                        .setTitle("Akinator")
                        .setDescription(`Welcome, **${message.author.tag}**!\nIt's seem like you first use Akinator bot, let me just get some stuff before we can continue...`)
                        .addField(`Default user options:`, `> Language: **English** :flag_gb:\n> Answer type: **Reaction** :white_check_mark::x:\n> Child mode: Disable :red_square:`)
                        .setFooter(`Setting up database for ${message.author.tag}...`)
                    message.channel.send(embed).then(async msg => {
                        var src_return = import_user.run(message);
                        if (src_return == "err") {
                            message.channel.send("Something went wrong! Please try again.");
                            msg.delete().catch();
                            return;
                        }
                        message.channel.send("All done!");
                        msg.delete({ timeout: 20000 }).catch();
                    })
                } else {
                    lang = result[0].language;
                    command.run(client, message, args, lang, result);
                }
            })
        }
    }

});

client.login(config.token);
const i18n = require("i18n");

module.exports = {
    getCommandDesc: (lang, name) => {
        i18n.setLocale(lang);
        var desc;
        switch (name) {
            case "start":
                desc = i18n.__("command.start.description");
                break;
            case "help":
                desc = i18n.__("command.help.description");
                break;
        }
        return desc;
    }
}
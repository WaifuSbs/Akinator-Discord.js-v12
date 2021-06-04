const Discord = require("discord.js");
const { Aki } = require("aki-api");
const on_going_games = new Set();
const i18n = require("i18n");
const config = require("../config.json");

module.exports = {
    run: async(client, message, lang, chose_theme, game_region, child_mode) => {
        i18n.setLocale(lang); // will do
    }
}
var game;

module.exports = {
    run: (client, message, lang, chose_theme, game_region, ans_mode, child_mode) => {
        if (ans_mode == "reaction") {
            game = require("./game_react");
            game.run(client, message, lang, chose_theme, game_region, child_mode);
        }
    }
}
const con = require("./sql");

module.exports = {
    run: (message) => {
        con.query("INSERT INTO users(userId) VALUES ('"+ message.author.id +"')", function(err, result) {
            if (err) return message.channel.send("Something went wrong with database! Please try again.");
        })
    }
}
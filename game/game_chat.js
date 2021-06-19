const Discord = require("discord.js");
const { Aki } = require("aki-api");
const i18n = require("i18n");
const config = require("../config.json");

module.exports = {
        run: async(client, message, lang, chose_theme, game_region, child_mode) => {
                i18n.setLocale(lang);
                const region = game_region;
                var aki;
                var cmt = "";
                if (child_mode == "true") {
                    aki = new Aki(region, true);
                    cmt = "(" + i18n.__("option.child_mode") + ")";
                } else {
                    aki = new Aki(region);
                }
                const embed_start = new Discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setTitle(`Akinator ${cmt}`)
                    .addField(i18n.__("game.startup.message"), `> ${i18n.__("theme.translate")}: **${chose_theme}**\n> ${i18n.__("channel.translate")}: ${message.guild.channels.cache.get(message.channel.id).name}`)
                    .setFooter(i18n.__("game.startup.footer").replace("%player%", message.author.tag))
                message.channel.send(embed_start).then(async embed => {
                    // Akinator
                    var err_bol = "";
                    await aki.start().catch(err => {
                        console.log(err);
                        err_bol = err;
                        message.channel.send("Something went wrong while starting the game! Please try again.");
                        embed.delete().catch();
                        return;
                    });
                    if (err_bol == "") {
                        embed.delete().catch();
                        aki_game();
                    }
                })

                function aki_game() {
                    const embed = new Discord.MessageEmbed()
                        .setColor(config.main_color)
                        .setAuthor(`${i18n.__("game.run.progress").replace("%progress%",parseFloat(aki.progress).toFixed(0))} / ${i18n.__("game.run.question").replace("%question_count%",parseFloat(aki.currentStep) + 1)}`)
                        .setTitle(`Akinator ${cmt}`)
                        // .setThumbnail(aki_thumbnail())
                        .setDescription(aki.question)
                        .addField(i18n.__("game.run.instruction_chat"), i18n.__("game.run.answers_chat"))
                        .addField(i18n.__("game.run.other_options"), `> **stop**. ${i18n.__("game.run.stop")} ${parseFloat(aki.currentStep) > 0 ? `\n> **back**. ${i18n.__("game.run.back")}`: ""}`)
                .setFooter(i18n.__("game.run.footer_chat").replace("%player%", message.author.tag));
            message.channel.send(embed).then(async ans => {
                const filter = m => m.author.id === message.author.id;
                var collector = message.channel.createMessageCollector(filter, { time: 30000 });
                var rec = "no";
                collector.on('collect', async answer => {
                    if (answer.content == "1") {
                        rec = "yes";
                        collector.stop();
                        await aki.step(0).catch(err => {
                            gameError(message, err, ans, answer);
                            return;
                        });
                        ans.delete().catch();
                        answer.delete().catch();
                        call_aki_game();
                    } else if (answer.content == "2") {
                        rec = "yes";
                        collector.stop();
                        await aki.step(1).catch(err => {
                            gameError(message, err, ans, answer);
                            return;
                        });
                        ans.delete().catch();
                        answer.delete().catch();
                        call_aki_game();
                    } else if (answer.content == "3") {
                        rec = "yes";
                        collector.stop();
                        await aki.step(2).catch(err => {
                            gameError(message, err, ans, answer);
                            return;
                        });
                        ans.delete().catch();
                        answer.delete().catch();
                        call_aki_game();
                    } else if (answer.content == "4") {
                        rec = "yes";
                        collector.stop();
                        await aki.step(3).catch(err => {
                            gameError(message, err, ans, answer);
                            return;
                        });
                        ans.delete().catch();
                        answer.delete().catch();
                        call_aki_game();
                    } else if (answer.content == "5") {
                        rec = "yes";
                        collector.stop();
                        await aki.step(4).catch(err => {
                            gameError(message, err, ans, answer);
                            return;
                        });
                        ans.delete().catch();
                        answer.delete().catch();
                        call_aki_game();
                    } if (answer.content.toLowerCase() == "back") {
                        rec = "yes";
                        collector.stop();
                        await aki.back().catch(err => {
                            gameError(message, err, ans, answer);
                            return;
                        });
                        ans.delete().catch();
                        answer.delete().catch();
                        call_aki_game();
                    } else if (answer.content.toLowerCase() == "stop") {
                        rec = "yes";
                        collector.stop();
                        await aki.win().catch(err => {
                            gameError(message, err, ans, answer);
                            return;
                        });
                        ans.delete().catch();
                        answer.delete().catch();
                        aki_end_user();
                    } else return;
                });

                collector.on('end', async() => {
                    if (rec == "no") {
                        ans.delete().catch();
                        const embed = new Discord.MessageEmbed()
                            .setColor(config.main_color)
                            .setAuthor(`Akinator ${cmt}`)
                            .setTitle(i18n.__("game.end.no_provided_answer"))
                            .setDescription(`> ${i18n.__("game.run.progress").replace("%progress%",parseFloat(aki.progress).toFixed(0))}\n> ${i18n.__("game.run.question").replace("%question_count%",parseFloat(aki.currentStep) + 1)}`)
                            .setFooter(`${i18n.__("game.end.footer").replace("%player%", message.author.tag)}\n${i18n.__("game.end.remove_msg_20s")}`)
                        message.channel.send(embed).then(async msg => {
                            await aki.win().catch();
                            msg.delete({ timeout: 19000 }).catch();
                        })
                    } else return;
                });
            })
        }

        async function call_aki_game() {
            if (aki.progress >= 70 || aki.currentStep >= 78) {
                await aki.win();
                if (child_mode == "true") {
                    if (aki.answers[0].pseudo == "X") {
                        const embed_ex = new Discord.MessageEmbed()
                            .setColor(config.main_color)
                            .setTitle(`Akinator`)
                            .setDescription(i18n.__("game.end.nsfw_content"))
                            .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                        message.channel.send(embed_ex);
                        return;
                    }
                }
                var answer = aki.answers[0].name;
                var answer_desc = aki.answers[0].description;
                var answer_pic = aki.answers[0].absolute_picture_path;
                const embed = new Discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(`Akinator ${cmt}`)
                    .setTitle(i18n.__("game.end.think_of").replace("%answer%", answer))
                    .setDescription(answer_desc)
                    .setImage(answer_pic)
                    .addField(i18n.__("game.end.correct"), i18n.__("game.end.correct_answer"))
                    .setFooter(i18n.__("game.run.footer").replace("%player%", message.author.tag))
                message.channel.send(embed).then(async correct => {
                    await correct.react('✅');
                    await correct.react("❌");

                    const filter = (reaction, user) => user.id != client.user.id && user.id == message.author.id;
                    var collector = correct.createReactionCollector(filter, { time: 15000 });
                    var rec = "no";
                    collector.on("collect", async(reaction, user) => {
                        if (reaction.emoji.name == "✅") {
                            aki_end_yes(answer, answer_desc, answer_pic);
                            correct.delete().catch();
                            rec = "yes";
                            collector.stop();
                        }
                        if (reaction.emoji.name == "❌") {
                            aki_end_no(answer, answer_desc, answer_pic);
                            correct.delete().catch();
                            rec = "yes";
                            collector.stop();
                        }
                    })

                    collector.on("end", async() => {
                        if (rec == "no") {
                            correct.delete().catch();
                            const embed = new Discord.MessageEmbed()
                                .setColor(config.main_color)
                                .setAuthor(`Akinator`)
                                .setTitle(i18n.__("game.end.no_correct"))
                                .setDescription(`> **${answer}**\n> ${answer_desc}`)
                                .setImage(answer_pic)
                                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                            message.channel.send(embed);

                        } else return;
                    })
                })
            } else {
                aki_game();
            }
        }

        function aki_end_yes(answer, answer_desc, answer_pic) {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(`Akinator ${cmt}`)
                .setTitle(i18n.__("game.end.aki_win"))
                .setDescription(`> **${answer}**\n> ${answer_desc}`)
                .setImage(answer_pic)
                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
            message.channel.send(embed);
        }

        function aki_end_no(answer, answer_desc, answer_pic) {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(`Akinator ${cmt}`)
                .setTitle(i18n.__("game.end.aki_lose_ask"))
                .setDescription(i18n.__("game.end.aki_lose_ans"))
                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
            message.channel.send(embed).then(async reply => {
                const filter = m => m.author.id === message.author.id;
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000
                }).then(collected => {
                    if (!collected.first()) {
                        const embed_reply = new Discord.MessageEmbed()
                            .setColor(config.main_color)
                            .setAuthor(`Akinator ${cmt}`)
                            .setTitle(i18n.__("game.end.aki_lose_win"))
                            .setDescription(`> **${answer}**\n> ${answer_desc}`)
                            .setImage(answer_pic)
                            .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                        message.channel.send(embed_reply);
                    } else {
                        if (collected.first().content.toLowerCase() == answer.toLowerCase()) {
                            const embed_reply = new Discord.MessageEmbed()
                                .setColor(config.main_color)
                                .setAuthor(`Akinator ${cmt}`)
                                .setTitle(i18n.__("game.end.aki_lose_same_ans"))
                                .setDescription(`> **${answer}**\n> ${answer_desc}`)
                                .setImage(answer_pic)
                                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                            message.channel.send(embed_reply);
                        } else {
                            const embed_reply = new Discord.MessageEmbed()
                                .setColor(config.main_color)
                                .setAuthor(`Akinator ${cmt}`)
                                .setTitle(i18n.__("game.end.aki_lose"))
                                .setDescription(i18n.__("game.end.explain").replace("%answer%", answer).replace("%player_answer%", collected.first().content))
                                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                            message.channel.send(embed_reply);
                        }
                    }
                })
            })
        }

        function aki_end_user() {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setTitle(`Akinator ${cmt}`)
                .setDescription(i18n.__("game.end.ended"))
                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
            message.channel.send(embed);
        }

        function gameError(message, error, uans, msgans) {
            msgans.delete().catch();
            uans.delete().catch();
            message.channel.send("Something went wrong while getting next question!")
            message.channel.send("```" + error + "```")
        }
    }
}
const Discord = require("discord.js");
const { Aki } = require("aki-api");
const on_going_games = new Set();
const i18n = require("i18n");
const config = require("../config.json");

module.exports = {
    run: async(client, message, lang, chose_theme, game_region, child_mode) => {
        i18n.setLocale(lang);
        // Only one game per channel
        if (on_going_games.has(message.channel.id)) {
            let channel = message.guild.channels.cache.get(message.channel.id);
            message.author.send(i18n.__("game.fail.already").replace("%channel.id%", message.channel.id).replace("%channel.name%", channel.name));
            return;
        }
        // Aki config
        const region = game_region;
        const childMode = child_mode;
        const aki = new Aki(region, childMode);

        on_going_games.add(message.channel.id);

        const embed_start = new Discord.MessageEmbed()
            .setColor(config.main_color)
            .setTitle("Akinator")
            .addField(i18n.__("game.startup.message"), `> ${i18n.__("theme.translate")}: **${chose_theme}**\n> ${i18n.__("channel.translate")}: ${message.guild.channels.cache.get(message.channel.id).name}`)
            .setFooter(i18n.__("game.startup.footer").replace("%player%", message.author.tag))
        message.channel.send(embed_start).then(async embed => {
            // Akinator
            await aki.start().catch(err => {
                console.log(err);
                release_channel();
            });
            embed.delete().catch();
            aki_game();
        })

        function aki_game() {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(`${i18n.__("game.run.progress").replace("%progress%",parseFloat(aki.progress).toFixed(0))} / ${i18n.__("game.run.question").replace("%question_count%",parseFloat(aki.currentStep) + 1)}`)
                .setTitle(`Akinator`)
                // .setThumbnail(aki_thumbnail())
                .setDescription(aki.question)
                .addField(i18n.__("game.run.instruction_react"), i18n.__("game.run.answers_react"))
                .setFooter(i18n.__("game.run.footer").replace("%player%", message.author.tag));
            message.channel.send(embed).then(async answer => {
                await answer.react('✅');
                await answer.react("❌");
                await answer.react("❔");
                await answer.react("👍");
                await answer.react("👎");

                const filter = (reaction, user) => user.id != client.user.id && user.id == message.author.id;
                var collector = answer.createReactionCollector(filter, { time: 30000 });
                var rec = "no";
                collector.on("collect", async(reaction, user) => {
                    if (reaction.emoji.name == "✅") {
                        await aki.step(0);
                        answer.delete().catch();
                        rec = "yes";
                        call_aki_game();
                        collector.stop();
                    }
                    if (reaction.emoji.name == "❌") {
                        await aki.step(1);
                        answer.delete().catch();
                        rec = "yes";
                        call_aki_game();
                        collector.stop();
                    }
                    if (reaction.emoji.name == "❔") {
                        await aki.step(2);
                        answer.delete().catch();
                        rec = "yes";
                        call_aki_game();
                        collector.stop();
                    }
                    if (reaction.emoji.name == "👍") {
                        await aki.step(3);
                        answer.delete().catch();
                        rec = "yes";
                        call_aki_game();
                        collector.stop();
                    }
                    if (reaction.emoji.name == "👎") {
                        await aki.step(4);
                        answer.delete().catch();
                        rec = "yes";
                        call_aki_game();
                        collector.stop();
                    }
                });

                collector.on("end", async() => {
                    if (rec == "no") {
                        answer.delete().catch();
                        const embed = new Discord.MessageEmbed()
                            .setColor(config.main_color)
                            .setAuthor(`Akinator`)
                            .setTitle(i18n.__("game.end.no_provided_answer"))
                            .setDescription(`> ${i18n.__("game.run.progress").replace("%progress%",parseFloat(aki.progress).toFixed(0))}\n> ${i18n.__("game.run.question").replace("%question_count%",parseFloat(aki.currentStep) + 1)}`)
                            .setFooter(`${i18n.__("game.end.footer").replace("%player%", message.author.tag)}\n${i18n.__("game.end.remove_msg_20s")}`)
                        message.channel.send(embed).then(async msg => {
                            release_channel();
                            await aki.win().catch();
                            msg.delete({ timeout: 19000 }).catch();
                        })
                    } else return;
                })
            })
        }

        async function call_aki_game() {
            if (aki.progress >= 70 || aki.currentStep >= 78) {
                await aki.win();
                var answer = aki.answers[0].name;
                var answer_desc = aki.answers[0].description;
                var answer_pic = aki.answers[0].absolute_picture_path;
                const embed = new Discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(`Akinator`)
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
                            release_channel();
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
                .setAuthor(`Akinator`)
                .setTitle(i18n.__("game.end.aki_win"))
                .setDescription(`> **${answer}**\n> ${answer_desc}`)
                .setImage(answer_pic)
                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
            message.channel.send(embed);
            release_channel();
        }

        function aki_end_no(answer, answer_desc, answer_pic) {
            const embed = new Discord.MessageEmbed()
                .setColor(config.main_color)
                .setAuthor(`Akinator`)
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
                            .setAuthor(`Akinator`)
                            .setTitle(i18n.__("game.end.aki_lose_win"))
                            .setDescription(`> **${answer}**\n> ${answer_desc}`)
                            .setImage(answer_pic)
                            .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                        message.channel.send(embed_reply);
                    } else {
                        if (collected.first().content.toLowerCase() == answer.toLowerCase()) {
                            const embed_reply = new Discord.MessageEmbed()
                                .setColor(config.main_color)
                                .setAuthor(`Akinator`)
                                .setTitle(i18n.__("game.end.aki_lose_same_ans"))
                                .setDescription(`> **${answer}**\n> ${answer_desc}`)
                                .setImage(answer_pic)
                                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                            message.channel.send(embed_reply);
                        } else {
                            const embed_reply = new Discord.MessageEmbed()
                                .setColor(config.main_color)
                                .setAuthor(`Akinator`)
                                .setTitle(i18n.__("game.end.aki_lose"))
                                .setDescription(i18n.__("game.end.explain").replace("%answer%", answer).replace("%player_answer%", collected.first().content))
                                .setFooter(i18n.__("game.end.footer").replace("%player%", message.author.tag))
                            message.channel.send(embed_reply);
                        }
                    }
                    release_channel();
                })
            })
        }

        function release_channel() {
            on_going_games.delete(message.channel.id);
        }
    }
}

module.exports.readSet = async() => {
    return on_going_games;
}
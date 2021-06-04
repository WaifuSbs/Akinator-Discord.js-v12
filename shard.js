const {ShardingManager} = require("discord.js");
const config = require("./config.json");

let shard_count = config.performance.shard_count;
if (shard_count == 0) shard_count = 'auto';

const shards = new ShardingManager("./bot.js", {
    token: config.token,
    totalShards: shard_count
});

shards.on("shardCreate", shard => {
    console.log('>==================================<');
    console.log(`Launched shard #${shard.id}`);
    console.log('>==================================<');
});

shards.spawn(shards.totalShards, 3000);
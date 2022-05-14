const Command = require("../Command");

module.exports = new Command('uptime', ['uptime', 'ut'], `%PREFIX%uptime`, `Get uptime of bot.`, async (msg, cl, bot) => {
    let uptime = process.uptime();
    let uptime_s = Math.floor(uptime % 60);
    let uptime_m = Math.floor(uptime / 60 % 60);
    let uptime_h = Math.floor(uptime / 60 / 60 % 24);
    let uptime_d = Math.floor(uptime / 60 / 60 / 24);
    let out = `Uptime: ${uptime_d}d ${uptime_h}h ${uptime_m}m ${uptime_s}s`;
    return out;
}, 0, 0, false);

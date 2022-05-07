const Command = require("../Command");
const pkg = require("../../package.json");

module.exports = new Command('version', ['version', 'v'], `%PREFIX%version`, undefined, (msg, cl) => {
    return `Version: ${pkg.version}`;
}, 0, 0, false);

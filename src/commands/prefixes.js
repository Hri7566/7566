const Command = require("../Command");
const prefixes = require("../prefixes");

module.exports = new Command('prefixes', ['prefixes'], `%PREFIX%prefixes`, undefined, (msg, cl) => {
    let str = "Prefixes: ";
    
    for (let [key, value] of prefixes) {
        str += `${key}: ${value.accessor} | `;
    }

    str = str.substring(0, str.length - 2).trim();

    return str;
}, 0, 0, true);

const Prefix = require("./Prefix");

let prefixes = new Map();

prefixes.set('asterisk', new Prefix('asterisk', '*'));
prefixes.set('7', new Prefix('7', '7'));
prefixes.set('caret', new Prefix('caret', '^'));
// prefixes.set('slash', new Prefix('slash', '/'));

module.exports = prefixes;

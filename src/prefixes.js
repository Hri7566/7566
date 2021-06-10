const Prefix = require("./Prefix");

let prefixes = new Map();

prefixes.set('7', new Prefix('7', '7'));
prefixes.set('caret', new Prefix('caret', '^'));

module.exports = prefixes;

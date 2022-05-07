const Prefix = require("./Prefix");

let prefixes = new Map();

if (process.env.NODE_ENV === "production") {
    prefixes.set('asterisk', new Prefix('asterisk', '*'));
} else {
    prefixes.set('asterisk', new Prefix('asterisk', '**'));
    prefixes.set('caret', new Prefix('caret', '^'));
}
prefixes.set('7', new Prefix('7', '7'));
prefixes.set('caret', new Prefix('caret', '^'));
prefixes.set('slash', new Prefix('slash', '/'));

module.exports = prefixes;

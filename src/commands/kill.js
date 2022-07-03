const Command = require("../Command");

let objects = [
    'a screw',
    'a bow',
    'a magnet',
    'a nail file',
    'coasters',
    'deodorant',
    'headphones',
    'pants',
    'a chair',
    'a hanger',
    'an ipod',
    'an electrical cord',
    'lip gloss',
    'soap',
    'a hair brush',
    'a credit card',
    'a blanket',
    'chalk',
    'perfume',
    'a puddle',
    'a paint brush',
    'nail clippers',
    'twister™','a slipper',
    'a USB drive',
    'a pair of glasses',
    'a computer',
    'a cell phone',
    'a box',
    'some clothes',
    'a lamp shade',
    'a buckel',
    'eye linertable',
    'a washing machine',
    'a zipper',
    'teddies',
    'a door',
    'a bed',
    'video games',
    'socks',
    'street lights',
    'a key chain',
    'tooth picks',
    'an eraser',
    'a sketch pad',
    'a keyboard',
    'a sandal',
    'a piano',
    'a clay pot',
    'fireworks',
    'explosives'
];

module.exports = new Command('kill', ['kill'], `%PREFIX%kill <user>`, undefined, async (msg, cl) => {
    if (cl.context !== 'mpp') return 'This command only works on MPP.';

    let p = cl.getPart(msg.argcat);

    if (!p) p = msg.p;

    if (!msg.argcat || p._id == msg.p._id) {
        return `In the ancient ritual of seppuku, ${msg.p.name} unsheaths their sword and runs it through their stomach.`;
    } else {
        return `${msg.p.name} kills ${p.name} with ${objects[Math.floor(Math.random() * objects.length)]}.`;
    }
}, 0, 0, true);

require('dotenv').config();

globalThis.Bot = require('./src');
const roomList = require('./roomList.json');

Bot.start(roomList);

require('dotenv').config();

const Bot7566 = require('./src');
const roomList = require('./roomList.json');

Bot7566.start(roomList);

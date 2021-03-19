const Registry = require('../lib/Registry');
const WSServer = require('./wsserver');
const DiscordClient = require('./discord');
const MPPClient = require('./mpp');

module.exports = class Bot {
    static wss = new WSServer(8080);
    static clients = new Registry();

    static start() {
        var c = new MPPClient(this, "RP Room", "wss://app.multiplayerpiano.com:443", "✧𝓡𝓟 𝓡𝓸𝓸𝓶✧");
    }
}

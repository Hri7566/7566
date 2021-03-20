const Logger = require('../lib/Logger');
const WSServer = require('./wsserver');
const Registry = require('../lib/Registry');
const Register = require('../lib/Register');

const Client = require('./client');
const ClientRegister = require('./ClientRegister');
const DiscordClient = require('./discord');
const MPPClient = require('./mpp');

module.exports = class Bot {
    static wss = new WSServer(8443);
    static clients = new Register();

    static logger = new Logger('7566');

    static prefixes = require('./prefixes');

    static start() {
        this.logger.log('Starting...');

        let mpplist = require('./mpplist');

        Object.keys(mpplist).forEach(uri => {
            let rooms = mpplist[uri];
            Object.keys(rooms).forEach(name => {
                let room = rooms[name];
                try {
                    let cl = new MPPClient(this, name, uri, room._id, room.proxy);
                    Registry.addData(cl);
                } catch (err) {
                    this.logger.error('Error adding client: ' + err.message);
                }
            });
        });

        process.on('SIGINT', signal => {
            this.logger.log(`SIGINT received.`);
            setTimeout(() => {
                process.exit(127);
            }, 10);
        });
    }
}

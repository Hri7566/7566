const fs = require('fs');
const path = require('path');

const Logger = require('../lib/Logger');
const WSServer = require('./wsserver');
const Registry = require('../lib/Registry');
const Register = require('../lib/Register');

const Client = require('./client');
const ClientRegister = require('../lib/ClientRegister');
const DiscordClient = require('./discord');
const MPPClient = require('./mpp');

const CommandRegister = require('../lib/CommandRegister');

const UserRegister = require('../lib/UserRegister');
const User = require('../lib/User');
const Rank = require('../lib/Rank')

module.exports = class Bot {
    static clients = new Register();
    static logger = new Logger('7566');
    static prefixes = require('./prefixes');
    static userdata = require('./users.json');

    static config = {
        mpp: {
            allowUserset: true
        },
        discord: {

        },
        wss: {
            port: 8080
        }
    }

    static wss = new WSServer(this.config.wss.port);

    static saveInterval = setInterval(() => {
        this.save();
    }, 60000);

    static start(config) {
        typeof(config) == 'object' ? this.config = config : this.config = this.config;
        this.logger.log('Starting...');
        let mpplist = require('./mpplist');

        Registry.setRegister(new ClientRegister());

        Object.keys(mpplist).forEach(uri => {
            let rooms = mpplist[uri];
            Object.keys(rooms).forEach(name => {
                let room = rooms[name];
                try {
                    let cl = new MPPClient(this, name, uri, room._id, room.proxy);
                    Registry.getRegister('client').add(cl);
                } catch (err) {
                    this.logger.error('Error adding client: ' + err.message);
                }
            });
        });

        Registry.getRegister('client').add('discord', new DiscordClient(this, this.config.discord.token));

        this.loadCommands();
        this.loadUserData();

        process.on('SIGINT', signal => {
            this.logger.log(`SIGINT received.`);
            this.save();
            setTimeout(() => {
                process.exit(127);
            }, 10);
        });
    }

    static loadCommands() {
        Registry.setRegister(new CommandRegister());
        fs.readdir(path.join(__dirname, 'commands'), 'utf8', (err, files) => {
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                try {
                    let cmd = require(path.join(__dirname, 'commands', file));
                    Registry.getRegister('command').add(cmd.name, cmd);
                } catch (err) {
                    this.logger.error(err);
                }
            });
            this.logger.log('Commands loaded');
        });
    }

    static loadUserData() {
        Registry.setRegister(new UserRegister(this.userdata));

        Object.keys(Registry.getRegister('user').data).forEach(id => {
            let user = Registry.getRegister('user').data[id];
            let nu = new User(user.name, user._id, user.color, user.rank);
            Object.keys(nu).forEach(pr => {
                if (typeof(user[pr]) == 'undefined') {
                    user[pr] = nu[pr];
                }
            });
        });
    }

    static getUser(msg) {
        let user = Registry.getRegister('user').get(msg.p._id);
        if (typeof(user) !== 'undefined') {
            return user;
        } else {
            let newuser = new User(msg.p.name, msg.p._id, msg.p.color, Rank.getRankFromName('none'));
            Registry.getRegister('user').add(msg.p._id, newuser);
            this.save();
            return newuser;
        }
    }

    static getUserById(_id) {
        return this.getUser({p:{_id: _id}});
    }

    static getRank(msg) {
        let rank = this.getUser(msg).rank;
        if (typeof(rank._id) == 'undefined') {
            Registry.registers['user'].data[msg.p._id].rank = Rank.getRankFromName('none');
            rank = this.getUser(msg).rank;
        }
        return rank;
    }

    static save() {
        this.logger.log('Saving...');
        this.saveUserData();
    }

    static saveUserData() {
        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(Registry.getRegister('user').data, null, 4), err => {
            if (err) {
                this.logger.error(err);
            }
            this.logger.log('User data saved.');
        });
    }
}

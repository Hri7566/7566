const fs = require('fs');
const path = require('path');
const level = require("level");

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

const ItemRegister = require('../lib/ItemRegister');

module.exports = class Bot {
    static clients = new Register();
    static logger = new Logger('7566');
    static prefixes = require('./prefixes');
    static userdata = level("./users.db");

    static config = {
        mpp: {
            allowUserset: true
        },
        discord: {
            enabled: false
        },
        wss: {
            port: 12345
        }
    }

    static wss = new WSServer(this.config.wss.port);

    static saveInterval = setInterval(() => {
        this.save(err => {
            if (err) {
                this.warn(`Save unsuccessful.`);
            }
        });
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
                    Registry.getRegister('client').add(name, cl);
                } catch (err) {
                    this.logger.error('Error adding client: ' + err.message);
                }
            });
        });

        if (this.config.discord.enabed) {
            Registry.getRegister('client').add('discord', new DiscordClient(this, this.config.discord.token));
        }

        this.loadCommands();
        this.loadItems();

        process.on('SIGINT', signal => {
            this.logger.log(`SIGINT received.`);
            this.save(() => {
                setTimeout(() => {
                    process.exit(127);
                }, 1500);
            });
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

    static loadItems() {
        Registry.setRegister(new ItemRegister());

        fs.readdir(path.join(__dirname, 'items'), 'utf8', (err, files) => {
            if (err) {
                this.logger.error('Unable to load items: ' + err);
                return;
            }
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                try {
                    let item = require(path.join(__dirname, 'items', file));
                    let itemname = file.substr(0, file.indexOf('.js'));
                    Registry.getRegister('item').add(itemname, item);
                } catch (err) {
                    this.logger.error('Unable to load item: ' + err);
                }
            });
        });
    }

    static getUser(msg) {
        let user;
        try {
            user = this.userdata.get(msg.p._id);
            return user;
        } catch (err) {
            let newuser = new User(msg.p.name, msg.p._id, msg.p.color, Rank.getRankFromName('none'));
            this.userdata.put(msg.p._id, newuser);
            this.save(() => {});
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

    static async save(cb) {
        this.logger.log('Saving...');
        try {
            await this.saveUserData();
            cb();
        } catch (err) {
            cb(err);
        }
    }

    static async saveUserData() {
        // fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(Registry.getRegister('user').data, null, 4), err => {
        //     if (err) {
        //         this.logger.error(err);
        //         return;
        //     }
        //     this.logger.log('User data saved.');
        // });
    }
}

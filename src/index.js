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
const Jobs = require('../lib/Jobs');

module.exports = class Bot {
    static clients = new Register();
    static logger = new Logger('7566');
    static prefixes = require('./prefixes');
    // static userdata = level("./users.db");
    static userdata = require('./users.json');

    static config = {
        mpp: {
            allowUserset: true,
            enabled: false
        },
        discord: {
            enabled: true
        },
        wss: {
            port: 7566
        }
    }

    static wss = new WSServer(this.config.wss.port);

    static saveInterval = setInterval(() => {
        this.save(err => {
            if (err) {
                this.logger.warn(`Save unsuccessful.`);
                console.error(err);
            }
        });
    }, 60000);

    static start(config) {
        typeof(config) == 'object' ? this.config = config : this.config = this.config;
        this.logger.log('Starting...');
        let mpplist = require('./mpplist');

        Registry.setRegister(new ClientRegister());

        if (this.config.mpp.enabled == true) {
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
        }

        if (this.config.discord.enabled == true) {
            Registry.getRegister('client').add('discord', new DiscordClient(this, this.config.discord.token));
        }

        this.load();

        process.on('SIGINT', signal => {
            this.logger.log(`SIGINT received.`);
            this.save(() => {
                setTimeout(() => {
                    process.exit(127);
                }, 1500);
            });
        });

    }

    static load() {
        this.loadCommands();
        this.loadUsers();
        this.loadItems();
        Jobs.loadJobs();
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

    static loadUsers() {
        Registry.setRegister(new UserRegister(this.userdata));

        // fix outdated user models / broken data

        Object.keys(Registry.getRegister('user').data).forEach(id => {
            let user = Registry.getRegister('user').data[id];
            let newUser = new User("Anonymous", "-1", "#000000", Rank.getRankFromName('none'));

            Object.keys(newUser).forEach(key => {
                if (typeof(user[key]) == 'undefined') {
                    user[key] = newUser[key];
                }
            });
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

    static balanceFormat(b) {
        try {
            let currencySymbol = "H$";
            let currencyStyle = "`${symbol}${amt}`"
            let amt = b.toString().substring(0, b.toString().indexOf(".") + 3);
            let symbol = currencySymbol;
            let parsed = eval(currencyStyle);
            return parsed;
        } catch (err) {
            if (err) {
                console.error(err);
                return "MISSINGNO.";
            }
        }
    }

    static getUser(msg) {
        let user = Registry.getRegister('user').get(msg.p._id);
        if (typeof(user) == 'undefined') {
            let newuser = new User(msg.p.name, msg.p._id, msg.p.color, Rank.getRankFromName('none'));
            this.userdata[msg.p._id] = newuser;
            this.saveUserData();
        }
        return Registry.getRegister('user').get(msg.p._id);
    }

    static getUserById(_id) {
        return this.getUser({p:{_id: _id}});
    }

    static findUser(str) {
        let data = Registry.getRegister('user').data;

        let ret;

        for (const id in data) {
            let user = data[id];
            if (typeof(user) == 'undefined') return;
            if (!user.hasOwnProperty('name') || !user.hasOwnProperty('_id')) return;
            if (user.name.toLowerCase().includes(str.toLowerCase()) || user._id.toLowerCase().includes(str.toLowerCase())) {
                ret = user;
            }
        }
        
        return ret;
    }

    static updateName(p) {
        try {
            Registry.getRegister('user').get(p._id).name = p.name;
            return true;
        } catch (err) {
            return false;
        }
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
            if (cb) cb();
        } catch (err) {
            if (cb) cb(err);
        }
    }

    static async saveUserData() {
        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(Registry.getRegister('user').data, null, 4), err => {
            if (err) {
                this.logger.error(err);
                return;
            }
            this.logger.log('User data saved.');
        });
    }
}

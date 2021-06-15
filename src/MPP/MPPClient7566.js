const Client7566 = require('../Client7566');
const MPPClient = require('./MPPClient');
const Cursor = require('./Cursor');
const Vector2 = require('../Geometry/Vector2');
const { ClientChatMessage, ServerChatMessage } = require('../Message');

class MPPClient7566 extends Client7566 {
    constructor (uri, room, token, proxy) {
        super('mpp');
        this.client = new MPPClient(uri, token);
        this.room = room;
        this.proxy = proxy;

        this.cursor = new Cursor();

        this.client.start();
        this.client.setChannel(room);
        this.lastCursorPos = new Vector2(-150, -150);

        this.bindClientEventListeners();
    }
    
    bindEventListeners() {
        super.bindEventListeners();

        this.on('cursor', (x, y) => {
            this.client.sendArray([{
                m: "m",
                x: Math.floor(x * 100) / 100,
                y: Math.floor(y * 100) / 100
            }]);
        });

        this.on('send', msg => {
            this.sendChat(msg.message);
        })
    }

    bindClientEventListeners() {
        this.client.on('hi', msg => {
            this.startCursorInterval();
            this.userset();
            console.log('MPP Online');
        });

        this.client.on('a', msg => {
            if (!msg.hasOwnProperty('m')) return;
            if (msg.m !== 'a') return;
            let m = new ServerChatMessage(msg.a, msg.p);

            this.emit('receive', m, this);
        });
    }

    userset(set) {
        if (!set) set = {name:"7566", color:"#8d3f50"};
        this.client.sendArray([{m:"userset", set:set}])
    }

    startCursorInterval() {
        this.cursor.defaultFigure();

        // let count = 0;
        // setInterval(() => {
        //     switch (count) {
        //         case 0:
        //             this.cursor.defaultLeaf();
        //             break;
        //         case 1:
        //             this.cursor.defaultDVD();
        //             break;
        //         case 2:
        //             this.cursor.defaultFigure();
        //             break;
        //         case 3:
        //             this.cursor.defaultFigureB();
        //             break;
        //     }

        //     count++;
        //     if (count > 3) count = 0;
        // }, 30000);

        this.cursorInterval = setInterval(() => {
            this.cursor.func();
            // this is entirely borked ;-;
            // if (this.cursor.position.x !== this.lastCursorPos.x && this.cursor.position.y !== this.lastCursorPos.y) {
                this.emit('cursor', this.cursor.position.x, this.cursor.position.y);
                // this.lastCursorPos = this.cursor.position;
            // }
        }, 1000/25);
    }

    sendChat(txt) {
        super.sendChat(txt);
        this.client.sendArray([new ClientChatMessage(txt)]);
    }
}

module.exports = MPPClient7566;

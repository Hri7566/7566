const Client7566 = require('../Client7566');
const MPPClient = require('./MPPClient');
const Cursor = require('../Geometry/Cursor');
const Vector2 = require('../Geometry/Vector2');

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

        this.bind();
        
    }
    
    bind() {
        this.client.on('hi', msg => {
            this.startCursorInterval();
        });
    }

    startCursorInterval() {
        // this.cursor.defaultDVD();
        this.cursor.defaultLeaf();
        this.cursorInterval = setInterval(() => {
            this.cursor.func();
            // if (this.cursor.position.x !== this.lastCursorPos.x && this.cursor.position.y !== this.lastCursorPos.y) {
                this.emit('cursor', this.cursor.position.x, this.cursor.position.y);
                // this.lastCursorPos = this.cursor.position;
            // }
        }, 1000/25);
    }
}

module.exports = MPPClient7566;

if (typeof module !== 'undefined') {
    //* node
    globalThis.WebSocket = require('ws');
    globalThis.EventEmitter = require('events').EventEmitter;
} else {
    //* browser
    // WebSocket is already defined

    class EventEmitter {
        #events = {};

        on(evt, func) {
            if (!this.#events[evt]) this.#events[evt] = [];
            
            this.#events[evt].push(func);
        }

        off(evt, func) {
            if (!this.#events[evt]) return;

            let i = this.#events[evt].indexOf(func);
            this.#events[evt].splice(i, 1);
        }

        emit(evt, ...args) {
            if (!this.#events[evt]) return;
            
            for (let func of this.#events[evt]) {
                func(...args);
            }
        }
    }
}

class Client extends EventEmitter {
    constructor(uri) {
        super();

        this.uri = uri;
        this.started = false;
        this.connectionAttempts = 0;

        this.bindEventListeners();
    }

    isSupported() {
        return typeof WebSocket !== 'undefined';
    }

    isConnected() {
        return this.ws.readyState == WebSocket.OPEN;
    }

    start() {
        if (this.started) return;
        this.started = true;
        this.ws = new WebSocket(this.uri);

        this.ws.addEventListener('open', () => {
            this.send([{
                m: 'hi',
                password: '7566'
            }]);

            this.send([{
                m: 'subscribe to admin stream',
                interval_ms: 1000
            }]);
        });

        this.ws.addEventListener('close', () => {
            this.stop();

            let connectionTimeout = this.connectionAttempts > 4 ? 10000 : 1000;

            setTimeout(() => {
                this.start();
            }, connectionTimeout);
        });

        this.ws.addEventListener('error', err => {
            this.emit('wserror', err);
        });

        this.ws.addEventListener('message', ev => {
            try {
                const jmsgs = ev.data.toString();
                const msgs = JSON.parse(jmsgs);
                for (let msg of msgs) {
                    if (typeof msg.m == 'undefined') return;
                    this.emit(msg.m, msgs);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    stop() {
        if (!this.started) return;

        if (this.ws) {
            this.send([{m: 'bye'}]);
            this.ws.close();
        }

        this.started = false;
    }

    bindEventListeners() {
        this.on('reset connection attempts', () => {
            this.connectionAttempts = 0;
        });

        this.on('hi', msg => {
            this.user = msg.u;
        });

        this.on('data', msg => {
            console.log(msg);
        });
    }

    send(data) {
        if (this.started) {
            this.ws.send(JSON.stringify(data));
        }
    }
}

let cl = new Client('ws://localhost:7566');
cl.start();

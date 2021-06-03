const { EventEmitter } = require("events");

class Client7566 extends EventEmitter {
    constructor (context) {
        super();
        this.context = context;
        this.bindEventListeners();
    }

    bindEventListeners() {
        this.on("send", msg => {

        });

        this.on("receive", msg => {

        });

        this.on("cursor", (x, y) => {
            console.log('received cursor: ' + Math.floor(x * 100) / 100 + ", " + Math.floor(y * 100) / 100);
            if (this.context == 'mpp') {
                this.client.sendArray([{m: "m", x: Math.floor(x * 100) / 100, y: Math.floor(y * 100) / 100}]);
            }
        });
    }
}

module.exports = Client7566;

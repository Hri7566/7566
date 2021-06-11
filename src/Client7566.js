const { ServerChatMessage } = require("./Message");
const RegisterEventEmitter = require("./RegisterEventEmitter");

class Client7566 extends RegisterEventEmitter {
    constructor (context) {
        super();
        this.context = context;
        this.bindEventListeners();
    }

    bindEventListeners() {
        this.on("send", msg => {

        });

        this.on("receive", (msg, cl) => {
            Bot.emit("receive", msg, cl);
        });

        // this.on("cursor", (x, y) => {
        //     if (this.context == 'mpp') {
        //         this.client.sendArray([{
        //             m: "m",
        //             x: Math.floor(x * 100) / 100,
        //             y: Math.floor(y * 100) / 100
        //         }]);
        //     }
        // });
    }

    sendChat(txt) {

    }
}

module.exports = Client7566;

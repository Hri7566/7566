const { Database } = require("./Database");
const Logger = require("./Logger");
const { ServerChatMessage } = require("./Message");
const RegisterEventEmitter = require("./RegisterEventEmitter");

class Client7566 extends RegisterEventEmitter {
    constructor (context) {
        super();
        this.context = context;
        this.bindEventListeners();
        this.logger = new Logger("Detached Client");
    }

    bindEventListeners() {
        this.on("receive", async (msg, cl) => {
            // await Database.createUser(msg.p);
            msg.user = await Database.getUser(msg.p._id);
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

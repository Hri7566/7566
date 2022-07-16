const { Database } = require("./Database");
const Logger = require("./Logger");
const { ServerChatMessage } = require("./Message");
const RegisterEventEmitter = require("./RegisterEventEmitter");

class Client7566 extends RegisterEventEmitter {
    constructor (id, context) {
        super(id);
        this.context = context;
        this.bindEventListeners();
        this.logger = new Logger("Detached Client");
    }

    bindEventListeners() {
        this.on("receive", async (msg, cl) => {
            this.emit("update username", msg, cl);
            // await Database.createUser(msg.p);
            msg.user = await Database.getUser(msg.p._id);
            Bot.emit("receive", msg, cl);
        });

        this.on("update username", async (msg, cl) => {
            Bot.emit("update username", msg, cl);
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

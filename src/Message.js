class Message {
    constructor (type, time) {
        this.m = type;
        this.t = time;
    }
}

class UserMessage extends Message {
    constructor (type, p) {
        super(type, Date.now());
        this.p = p;
    }

    get participant() {
        return this.p;
    }
}

class ServerChatMessage extends UserMessage {
    constructor (text, p) {
        super('a', p);
        this.a = text;
    }
}

class ClientChatMessage extends UserMessage {
    constructor (text, p) {
        super('a', p);
        this.message = text;
    }
}

class UsersetMessage extends Message {
    constructor (set) {
        super('userset');
        this.set = set;
    }
}

class ChsetMessage extends Message {
    constructor (set) {
        super('chset');
        this.set = set;
    }
}

class BotIncomingChatMessage extends ServerChatMessage {
    constructor (msg) {
        super(msg.a, msg.p);
        this.args = this.a.split(' ');

        Bot.prefixes.forEach(prefix => {
            if (this.a.startsWith(prefix.accessor)) {
                this.usedPrefix = prefix;
            }
        });

        if (!this.usedPrefix) return;

        this.cmd = this.args[0].substring(this.usedPrefix.accessor.length);
        this.argcat = this.a.substring(this.args[0].length).trim();
    }
}

module.exports = {
    Message,
    ServerChatMessage,
    ClientChatMessage,
    UsersetMessage,
    ChsetMessage,
    BotIncomingChatMessage
};

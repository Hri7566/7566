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

    get getParticipant() {
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

module.exports = {
    Message,
    ServerChatMessage,
    ClientChatMessage,
    UsersetMessage,
    ChsetMessage
};

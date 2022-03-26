const { createHash } = require('crypto');

class Crypto {
    static getID(ip) {
        if (!ip) return;
        let hash = createHash('sha3-512');
        hash.write('saltsalt');
        hash.write(ip);
        hash.digest();
        hash.end();
        return hash.read().toString('hex').substr(0, 24);
    }

    static getNowID() {
        let hash = createHash('sha3-512');
        hash.write(Date.now().toString());
        hash.digest();
        hash.end();
        return hash.read().toString('hex').substr(0, 24);
    }

    static getColor(_id) {
        if (!_id) return;
        let hash = createHash('sha3-512');
        hash.write(_id);
        hash.digest();
        hash.end();
        return "#" + hash.read().toString('hex').substr(0, 6);
    }
}

module.exports = {
    Crypto
}

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

class Database {
    static db = mongoose.connection;

    async getUser() {
        
    }
}

module.exports = Database;

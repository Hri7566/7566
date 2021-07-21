const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URL, {
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const rankSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    id: Number
});

const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    rank: rankSchema,
    flags: Object
});

const User = mongoose.model('User', userSchema);
const Rank = mongoose.model('Rank', rankSchema);

class Database {
    static db = mongoose.connection;

    static async getUser(_id) {
        let user = await User.findOne({_id: _id}).exec();
        if (user !== null) {
            if (typeof user.rank.id == "undefined") user.rank.id = 0, user.save();
        }
        return user;
    }

    static async createUser(p) {
        if (!p) return;
        if (!p.hasOwnProperty('_id')) return;
        let already = await Database.getUser(p._id);
        if (already !== null) return already;
        try {
            let user = await new User({
                _id: p._id,
                name: p.name,
                rank: p.rank || new Rank({_id: 0, name: "None", id: 0}),
                flags: {}
            });
            
            // await user.rank.save();
            await user.save();

            return user;
        } catch (err) {
            console.error(err);
        }
    }

    static async getRank(_id) {
        let user = await this.getUser(_id);
        return user.rank;
    }

    static async setRank(_id, rank) {
        let user = await this.getUser(_id);
        user.rank = new Rank(rank);
        await user.save();
        return;
    }
}

module.exports = Database;

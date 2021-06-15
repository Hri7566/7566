const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URL, {
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const rankSchema = new mongoose.Schema({
    _id: Number,
    name: String
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
        return user;
    }

    static async createUser(p) {
        if (!p.hasOwnProperty('_id')) return;
        let already = await Database.getUser(p._id);
        if (already !== null) return already;
        try {
            let user = await new User({
                _id: p._id,
                name: p.name,
                rank: p.rank || new Rank({_id: 0, name: "None"}),
                flags: {}
            });

            if (p._id == 'f46132453478f0a8679e1584') {
                user.rank = new Rank({_id: 4, name: "Owner"});
            }
            
            // await user.rank.save();
            await user.save();

            return user;
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = Database;

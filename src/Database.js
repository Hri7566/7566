const mongoose = require('mongoose');
const { EventEmitter } = require('events');

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
    color: String,
    rank: rankSchema,
    flags: Object
});

const jobSchema = new mongoose.Schema({
    job_id: String,
    user_id: String,
    stopDate: Number,
    flags: Object
});

const inventorySchema = new mongoose.Schema({
    user_id: String,
    items: Object
}, {
    minimize: false,
    versionKey: false
});

const User = mongoose.model('User', userSchema);
const Rank = mongoose.model('Rank', rankSchema);
const Job = mongoose.model('Job', jobSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);

class Database {
    static db = mongoose.connection;

    static async getUser(_id) {
        let user = await User.findOne({_id: _id}).exec();
        if (user !== null) {
            if (typeof user.rank == "undefined") user.rank = new Rank({_id: 0, name: "None"}), user.save();
            if (typeof user.rank.id == "undefined") user.rank.id = 0, user.save();
            if (!user.hasOwnProperty('color')) user.color = "#777";
        }
        return user;
    }

    static async getUserFuzzy(_id) {
        let user = await User.findOne({_id: {$regex: _id}}).exec();
        return await this.getUser(user._id);
    }

    static async createUser(p) {
        if (!p) return;
        if (!p.hasOwnProperty('_id')) return;
        let already = await Database.getUser(p._id);
        // console.log(already);
        if (already !== null) return already;
        try {
            let user = await new User({
                _id: p._id,
                name: p.name,
                rank: p.rank || new Rank({_id: 0, name: "None", id: 0}),
                color: p.color || "#777",
                flags: {}
            });
            
            // await user.rank.save();
            await user.save();

            user = await Database.getUser(p._id);
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

    static async createJob(j) {
        if (!j) return;
        if (!j.hasOwnProperty('job_id')) return;
        let already = await Database.getJob(j._id);
        if (already !== null) return already;
        try {
            let job = await new Job({
                job_id: j.job_id,
                user_id: j.user_id,
                stopDate: j.stopDate
            });

            await job.save();

            job = Database.getJob(job.user_id);
            return job;
        } catch (err) {
            console.error(err);
        }
    }

    static async getJob(user_id) {
        let job = await Job.findOne({user_id: user_id}).exec();
        if (job !== null) {
            if (typeof job.rank.id == "undefined") job.rank.id = 0, job.save();
        }
        return job;
    }

    static async getAllJobs() {
        return await Job.find({});
    }

    static async updateJob(user_id, job) {
        let j = await this.getJob(user_id);

        j.job_id = job.job_id;
        j.user_id = job.user_id;
        j.stopDate = job.stopDate;

        j.save();

        return await this.getJob(j.user_id);
    }

    static async updateName(user_id, name) {
        let u = await this.getUser(user_id);
        if (u == null) return;

        u.name = name;

        u.save();

        return await this.getUser(user_id);
    }

    static async updateColor(user_id, color) {
        let u = await this.getUser(user_id);
        if (u == null) return;

        u.color = color;
        u.save();

        return await this.getUser(user_id);
    }

    static async createInventory(_id, items) {
        if (!_id) return;
        if (!items) items = {};
        let already = await Database.getInventory(_id);
        if (already !== null) return already;
        try {
            await new Inventory({
                user_id: _id,
                items: items
            }).save();
        } catch (err) {
            console.error(err);
        }
        return await Database.getInventory(_id);
    }

    static async getInventory(_id) {
        let inventory = await Inventory.findOne({user_id: _id}).exec();
        return inventory;
    }

    static on = EventEmitter.prototype.on;
    static off = EventEmitter.prototype.off;
    static once = EventEmitter.prototype.once;
    static emit = EventEmitter.prototype.emit;
}

module.exports = {
    Database,
    User,
    Rank,
    Job,
    Inventory
};

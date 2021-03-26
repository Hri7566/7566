module.exports = class User {
    constructor (name, id, color, rank) {
        this.name = name;
        this._id = id;
        this.color = color;
        this.rank = rank;

        // Added 3/24
        this.inventory = {};
    }

    static regenUser(user) {
        user = new User(user.name, user._id, user.color, user.rank);
        return user;
    }
}

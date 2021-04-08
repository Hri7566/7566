module.exports = class User {
    constructor (name, id, color, rank) {
        this.name = typeof(name) == 'string' ? name : "borked user";
        this._id = id;
        this.color = color;
        this.rank = rank;

        // Added 3/24
        this.inventory = {};

        // Added 3/27
        this.balance = 0;
        this.lastClaimed = 0;
    }
}

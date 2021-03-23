module.exports = class User {
    constructor (name, id, color, rank) {
        this.name = name;
        this._id = id;
        this.color = color;
        this.rank = rank;
    }
}

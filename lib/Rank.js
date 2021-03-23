module.exports = class Rank {
    constructor (name, id) {
        this.name = name;
        this._id = id;
    }

    static getRankFromName(name) {
        switch (name) {
            case "none":
            case "user":
                return new Rank('User', 0);
                break;
            case "moderator":
            case "mods":
            case "mod":
                return new Rank('Moderator', 1);
                break;
            case "administrator":
            case "admin":
                return new Rank('Administrator', 2);
                break;
            case "godministrator":
            case "godmin":
                return new Rank('Godministrator', 3);
                break;
            case "owner":
                return new Rank('Owner', 4);
                break;
            case "bacon":
                return new Rank('Bacon', 69);
                break;
        }
    }
}
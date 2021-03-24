module.exports = class Rank {
    constructor (name, id) {
        this.name = name;
        this._id = id;
    }

    static getRankFromName(name) {
        let ret;
        switch (name) {
            case "none":
            case "user":
                ret = new Rank('None', 0);
                break;
            case "moderator":
            case "mods":
            case "mod":
                ret = new Rank('Moderator', 1);
                break;
            case "administrator":
            case "admin":
                ret = new Rank('Administrator', 2);
                break;
            case "godministrator":
            case "godmin":
                ret = new Rank('Godministrator', 3);
                break;
            case "owner":
                ret = new Rank('Owner', 4);
                break;
            case "bacon":
                ret = new Rank('Bacon', 69);
                break;
        }
        return ret;
    }
}
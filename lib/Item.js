module.exports = class Item {
    constructor (name, inShop, useFunc) {
        this.name = name;
        this.count = 1;
        this.inShop = typeof(inShop) == 'boolean' ? inShop : false;
        this.useFunc = () => {
            return `You can't use this item.`;
        }
        if (typeof(useFunc) !== 'undefined') {
            this.useFunc = useFunc;
        }
    }
}
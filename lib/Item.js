module.exports = class Item {
    constructor (name, inShop, useFunc, price) {
        this.name = name;
        this.count = 1;
        this.inShop = typeof(inShop) == 'boolean' ? inShop : false;

        this.useFunc = () => {
            return `This item doesn't do anything.`;
        }

        if (typeof(useFunc) == 'function') {
            this.useFunc = useFunc;
        }

        this.price = typeof(price) == 'number' ? price : 10;
    }
}
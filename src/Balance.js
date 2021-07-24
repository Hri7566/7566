class Balance {
    value;

    constructor (val) {
        this.value = val || 0;
    }

    [Symbol.toPrimitive]() {
        return `H$${this.value.toFixed(2)}`;
    }
}

module.exports = Balance;

const fs = require('fs');
const path = require('path');
const Logger = require('../lib/Logger');
const ShopItem = require('../lib/ShopItem');

module.exports = class Shop {
    static logger = new Logger('Shop');

    static init() {
        // TODO: load items from item register instead
        // fs.readdir(path.join(__dirname, "items"), 'utf8', (err, files) => {
        //     files.forEach(file => {
        //         try {
        //             let item = require(path.join(__dirname, 'items', file));
        //             if (item.inShop) {
        //                 this.items[file.substr(0, file.indexOf('.js'))] = new ShopItem(item);
        //             }
        //         } catch (err) {
        //             this.logger.error(err);
        //         }
        //     });
        // })
    }
}
const { EventEmitter } = require('events');
const Vector2 = require("../Geometry/Vector2");

const SCREEN_BOUNDARIES = {
    top: 0,
    left: 0,
    bottom: 100,
    right: 100
}

class Cursor extends EventEmitter {
    constructor () {
        super();
        this.position = new Vector2(SCREEN_BOUNDARIES.right/2,SCREEN_BOUNDARIES.bottom/2);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);

        this.time = Date.now();
        this.deltaTime = 0;
        this.oldTime = Date.now();

        this.follow;

        this.currentPattern;

        this.old = {
            time: 0,
            deltaTime: 0,
            velocity: new Vector2(0, 0),
            position: new Vector2(0, 0),
            acceleration: new Vector2(0, 0)
        };

        let patterns = new Map();

        patterns.set("dvd", () => {
            this.position = new Vector2(SCREEN_BOUNDARIES.left + Math.random() * SCREEN_BOUNDARIES.right, SCREEN_BOUNDARIES.top + Math.random() * SCREEN_BOUNDARIES.bottom);
            this.velocity = new Vector2(1, 1);

            this.func = () => {
                this.time = Date.now();
                this.deltaTime = (this.time - this.old.time)/1000;

                this.position.x += this.velocity.x * this.deltaTime;
                this.position.y += this.velocity.y * this.deltaTime;
                
                if (this.position.y < SCREEN_BOUNDARIES.top || this.position.y > SCREEN_BOUNDARIES.bottom) {
                    this.velocity.y = -this.velocity.y;
                }

                if (this.position.x < SCREEN_BOUNDARIES.left || this.position.x > SCREEN_BOUNDARIES.right) {
                    this.velocity.x = -this.velocity.x;
                }

                this.old.time = this.time;
            }
        });

        patterns.set("leaf", () => {
            this.position = new Vector2(SCREEN_BOUNDARIES.right/2, SCREEN_BOUNDARIES.top);
            this.velocity = new Vector2(1, 2);

            let angle = 0;

            let width = 5;

            this.func = () => {
                this.time = Date.now();
                this.deltaTime = (this.time - this.old.time)/1000;

                angle += 3 * this.deltaTime;

                this.position.x = (((Math.floor(Math.sin(angle) * 100)/100) * width)) + 50;
                // console.log(angle + ": " + this.position.x);
                
                this.velocity.y = (Math.abs(this.old.position.x - this.position.x)/2) - Math.sin(angle*2)/((10 + 5)/width) + 0.01;

                this.position.y += this.velocity.y/1.5;

                if (this.position.y > SCREEN_BOUNDARIES.bottom) {
                    this.position.y = SCREEN_BOUNDARIES.top;
                }

                this.old.position.x = this.position.x;
                this.old.time = this.time;
            }
        });

        patterns.set("figure", () => {
            this.position = new Vector2(SCREEN_BOUNDARIES.right/2, SCREEN_BOUNDARIES.top);
            this.velocity = new Vector2(1, 2);

            let angle = 0;

            let width = 10;
            let height = 10;

            this.func = () => {
                this.time = Date.now();
                this.deltaTime = (this.time - this.old.time)/1000;

                angle += 3 * this.deltaTime;

                this.position.x = (((Math.floor(Math.sin(angle) * 100)/100) * width)) + 50;
                // console.log(angle + ": " + this.position.x);
                
                this.velocity.y = 50 - height + (Math.sin(angle*2)/((10 + 5)/width) + 1) * height;

                this.position.y = this.velocity.y

                if (this.position.y > SCREEN_BOUNDARIES.bottom) {
                    this.position.y = SCREEN_BOUNDARIES.top;
                }

                this.old.position.x = this.position.x;
                this.old.time = this.time;
            }
        });

        patterns.set("figureb", () => {
            this.position = new Vector2(SCREEN_BOUNDARIES.right/2, SCREEN_BOUNDARIES.top);
            this.velocity = new Vector2(1, 2);

            let angle = 0;

            let width = 10;
            let height = 10;

            let r = 0;

            this.func = () => {
                this.time = Date.now();
                this.deltaTime = (this.time - this.old.time)/1000;

                angle += 1 * this.deltaTime;

                this.position.x = ((Math.floor(Math.sin(2 * angle) * 100)/100) * width) + 50
                // console.log(angle + ": " + this.position.x);

                this.position.y = ((Math.floor(Math.sin(3 * angle) * 100)/100) * width) + 50

                if (this.position.y > SCREEN_BOUNDARIES.bottom) {
                    this.position.y = SCREEN_BOUNDARIES.top;
                }

                this.old.position.x = this.position.x;
                this.old.time = this.time;
            }
        });

        patterns.set("figurec", () => {
            this.position = new Vector2(SCREEN_BOUNDARIES.right/2, SCREEN_BOUNDARIES.bottom/2);
            this.velocity = new Vector2(1, 2);

            let angle = 0;

            let width = 10;
            let height = 10;

            let r = 0;

            let x = 50;
            let velx = 2/5;
            let vely = 2/7;
            let y = 50;

            this.func = () => {
                this.time = Date.now();
                this.deltaTime = (this.time - this.old.time)/1000;

                angle += 0.25 * this.deltaTime;

                this.position.x = ((Math.floor(Math.sin(8 * angle) * 100)/100) * width) + x;
                // console.log(angle + ": " + this.position.x);

                this.position.y = ((Math.floor(Math.sin(13 * angle) * 100)/100) * width) + y;

                // if (this.position.y > SCREEN_BOUNDARIES.bottom) {
                //     this.position.y = SCREEN_BOUNDARIES.top;
                // }

                x += velx;
                y += vely;

                if (x > 90 || x < 10) {
                    velx = -velx;
                }

                if (y > 90 || y < 10) {
                    vely = -vely;
                }

                this.old.position.x = this.position.x;
                this.old.time = this.time;
            }
        });

        patterns.set("rave", () => {
            this.position = new Vector2(SCREEN_BOUNDARIES.right/2, SCREEN_BOUNDARIES.bottom/2);
            this.velocity = new Vector2(1, 2);

            let width = 10;
            let height = 10;

            let r = 0;

            this.func = () => {
                this.time = Date.now();
                this.deltaTime = this.oldTime - this.time;

                this.acceleration.x = this.position.x - this.old.position.x;
                this.acceleration.y = this.position.y - this.old.position.y;
                
                this.velocity.x += this.acceleration.x;
                this.velocity.y += this.acceleration.y;

                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;

                this.old.time = this.time;
            }
        });

        patterns.set("circle", () => {
            this.position = new Vector2(SCREEN_BOUNDARIES.right/2, SCREEN_BOUNDARIES.bottom/2);
            this.velocity = new Vector2(1, 2);

            let angle = 0;

            let width = 10;
            let height = 10;

            let r = 0;

            this.func = () => {
                this.time = Date.now();
                this.deltaTime = (this.time - this.old.time)/1000;

                angle += 3 * this.deltaTime;

                this.position.x = ((Math.floor(Math.cos(angle) * 100)/100) * width) + 50
                // console.log(angle + ": " + this.position.x);

                this.position.y = ((Math.floor(Math.sin(angle) * 100)/100) * width) + 50

                if (this.position.y > SCREEN_BOUNDARIES.bottom) {
                    this.position.y = SCREEN_BOUNDARIES.top;
                }

                this.old.position.x = this.position.x;
                this.old.time = Date.now();
            }
        });
        
        this.patterns = patterns;

        this.on('change_pattern', pat => {
            let func = this.patterns.get(pat);
            if (func) {
                func();
                this.currentPattern = pat;
            }
        });
    }
}

module.exports = Cursor;

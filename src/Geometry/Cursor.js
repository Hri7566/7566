const Vector2 = require("./Vector2");

const SCREEN_BOUNDARIES = {
    top: 0,
    left: 0,
    bottom: 100,
    right: 100
}

class Cursor {
    constructor () {
        this.position = new Vector2(SCREEN_BOUNDARIES.right/2,SCREEN_BOUNDARIES.bottom/2);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);

        this.time = Date.now();
        this.deltaTime = 0;
        this.oldTime = Date.now();

        this.old = {
            time: 0,
            deltaTime: 0,
            velocity: new Vector2(0, 0),
            position: new Vector2(0, 0),
            acceleration: new Vector2(0, 0)
        };
    }

    func() {

    }

    defaultDVD() {
        this.position = new Vector2(Math.random() * SCREEN_BOUNDARIES.right, Math.random() * SCREEN_BOUNDARIES.bottom);
        this.velocity = new Vector2(1, 2);

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

            this.old.time = Date.now();
        }
    }

    defaultLeaf() {
        this.position = new Vector2(SCREEN_BOUNDARIES.right/2, SCREEN_BOUNDARIES.top);
        this.velocity = new Vector2(1, 2);

        let angle = 0;

        let width = 5;

        this.func = () => {
            this.time = Date.now();
            this.deltaTime = (this.time - this.old.time)/1000;

            angle += 0.1;

            this.position.x = (((Math.floor(Math.sin(angle) * 100)/100) * width)) + 50;
            // console.log(angle + ": " + this.position.x);
            
            this.velocity.y = (Math.abs(this.old.position.x - this.position.x)/2) - Math.sin(angle*2)/((10 + 5)/width) + 0.01;

            this.position.y += this.velocity.y/1.5;

            if (this.position.y > SCREEN_BOUNDARIES.bottom) {
                this.position.y = SCREEN_BOUNDARIES.top;
            }

            this.old.position.x = this.position.x;
            this.old.time = Date.now();
        }
    }
}

module.exports = Cursor;

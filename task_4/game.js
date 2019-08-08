let game = {
    width: 300,
    height: 300,
    bricks: [],
    col: 4,
    row: 3,
    score: 0,
    images: {
        ball: undefined,
        brick: undefined,
        platform: undefined
    },
    isRun: true,
    init() {
        const canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");

        window.addEventListener("keydown", (e) => {
            const { platform, width } = game;
            if (e.keyCode === 37 && platform.x > 0) {
                platform.dx = -platform.speed
            } else if (e.keyCode === 39 && platform.x < width - platform.width) {
                platform.dx = platform.speed
            } else if (e.keyCode === 32) {
                platform.throwBall()
            }
        })

        window.addEventListener("keyup", () => game.platform.stop())
    },
    load() {
        for (let key in this.images) {
            this.images[key] = new Image();
            this.images[key].src = `img/${key}.png`;
        }
    },
    createBricks() {
        for (let j = 0; j < this.row; j++) {
            for (let i = 0; i < this.col; i++) {
                this.bricks.push({
                    x: 68 * i + 16,
                    y: 36 * j + 20,
                    width: 64,
                    height: 32,
                    isAlive: true
                })
            }
        }
    },
    start() {
        this.init();
        this.load();
        this.createBricks();

        this.run();
    },
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.bricks.forEach((element) => {
            if (element.isAlive) {
                this.ctx.drawImage(this.images.brick, element.x, element.y)
            }
        });
        this.ctx.drawImage(this.images.ball, this.ball.x, this.ball.y);
        this.ctx.drawImage(this.images.platform, this.platform.x, this.platform.y);
    },
    update() {
        if (this.platform.dx) {
            this.platform.move();
        }

        if (this.ball.dx || this.ball.dy) {
            this.ball.move();
        }

        if (this.ball.collide(this.platform)) {
            this.ball.hitPlatform(this.platform)
        }

        this.bricks.forEach((element) => {
            if (element.isAlive) {
                if (this.ball.collide(element)) {
                    this.ball.hitBlock(element)
                }
            }
        })

        this.ball.checkBounce();
        this.platform.checkBounce();
    },
    run() {
        this.update();
        this.render();

        if (this.isRun) {
            window.requestAnimationFrame(() => {
                game.run()
            })
        }
    },
    over(message) {
        alert(message);
        this.isRun = false;
        window.location.reload();
    }
}

game.ball = {
    x: 150,
    y: 245,
    width: 25,
    height: 25,
    speed: 2,
    dx: 0,
    dy: 0,
    throw() {
        this.dx = -this.speed;
        this.dy = -this.speed;
    },
    move() {
        this.x += this.dx;
        this.y += this.dy;
    },
    collide(element) {
        const x = this.x + this.dx;
        const y = this.y + this.dy;

        if (x + this.width > element.x &&
            x < element.x + element.width &&
            y + this.height > element.y &&
            y < element.y + element.height) {
            return true
        }
        return false
    },
    hitBlock(element) {
        this.dy *= -1;
        element.isAlive = false;
        ++game.score;
        
        if (game.score >= game.bricks.length) {
            game.over("You Win!")
        }
    },
    hitPlatform(element) {
        this.dy = -this.speed;
    },
    checkBounce() {
        const x = this.x + this.dx;
        const y = this.y + this.dy;

        if (x < 0) {
            this.x = 0;
            this.dx = this.speed;
        } else if (x + this.width > game.width) {
            this.x = game.width - this.width;
            this.dx = -this.speed;
        } else if (y < 0) {
            this.y = 0;
            this.dy = this.speed;
        } else if (y > game.height) {
            game.over("Game over!");
        }
    }
}

game.platform = {
    x: 100,
    y: 270,
    width: 128,
    height: 25,
    speed: 2,
    dx: 0,
    ball: game.ball,
    move() {
        this.x += this.dx;

        if (this.ball) {
            this.ball.x += this.dx
        }
    },
    throwBall() {
        if (this.ball) {
            this.ball.throw();
            this.ball = false;
        }
    },
    stop() {
        this.dx = 0;

        if (this.ball) {
            this.ball.dx = 0;
        }
    },
    checkBounce() {
        if (this.x < 0) {
            this.stop();
        } else if (this.x + this.width > game.width) {
            this.stop();        
        }
    }
}

window.addEventListener("load", () => game.start())

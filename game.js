class Demo1 extends AdventureScene {
    constructor() {
        super("demo1", "First Room");
    }

    onEnter() {

        let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Metal, bent."))
            .on('pointerdown', () => {
                this.showMessage("No touching!");
                this.tweens.add({
                    targets: clip,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("It's a nice key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You pick up the key.");
                this.gainItem('key');
                this.tweens.add({
                    targets: key,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    onComplete: () => key.destroy()
                });
            })

        let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("key")) {
                    this.showMessage("You've got the key for this door.");
                } else {
                    this.showMessage("It's locked. Can you find a key?");
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem("key")) {
                    this.loseItem("key");
                    this.showMessage("*squeak*");
                    door.setText("🚪 unlocked door");
                    this.gotoScene('demo2');
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.add.text(50,50, "Adventure awaits!").setFontSize(50);
        this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('logo'));
        });
    }
}

class Logo extends Phaser.Scene{
    constructor(){
        super("logo");
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("gamemaker", "gamemaker.png");
        this.load.audio('meow', 'funny-meow-110120.mp3');
    }

    create()
    {
        const centerX = this.game.config.width / 2;
                const centerY = this.game.config.height / 2;
                var rotateAngle = 0;

                this.cameras.main.fadeIn(1000, 255, 255, 255);

                this.lights.enable();
                this.lights.setAmbientColor(0x808080);

                var spotlight = this.lights.addLight(pointer => pointer.x, pointer => pointer.x, 35).setIntensity(6);

                this.input.on('pointermove', pointer => {

                    spotlight.x = pointer.x;
                    spotlight.y = pointer.y;

                });

                let timer = this.time.addEvent({
                    delay: 80,
                    callback: createCircle,
                    callbackScope: this,
                    loop: true
                });

                function createCircle() {
                    let color = Phaser.Display.Color.RandomRGB(50, 255);

                    rotateAngle += 0.23;

                    let circle = this.add.circle(centerX + 150 * Math.cos(rotateAngle), centerY + 150 * Math.sin(rotateAngle), 13, color.color);

                    circle.setPipeline('Light2D');

                    this.tweens.add({
                        targets: circle,
                        alpha: 0,
                        scale: 2.2,
                        duration: 2500,
                        onComplete: function () {
                            circle.destroy();
                        }
                    });
                }

                var logoImage = this.add.image(
                    centerX,
                    centerY,
                    'gamemaker'
                )
                logoImage.setScale(0.1);
                logoImage.alpha = 0;
                logoImage.setPipeline('Light2D');

                this.tweens.add({
                    targets: logoImage,
                    alpha: 1,
                    scaleX: 0.4,
                    scaleY: 0.4,
                    angle: -10,
                    duration: 1000,
                    ease: "liner"
                });

                let logoBgm = this.sound.add('meow', { loop: false });

                logoBgm.play();

                this.input.on('pointerdown', () => {
                    this.time.delayedCall(1000, () => {
                        this.cameras.main.fadeOut(1000, 255, 255, 255);
                        this.time.delayedCall(2000, () => {
                            this.scene.start('menu');
                        });
                    });
                });
    }
}

class Menu extends AdventureScene{

    constructor(){
        super("menu","Menu");
    }

    onEnter(){
        let starttext = this.add.text(this.w * 0.3, this.w * 0.4, "Start")
        .setFontSize(this.s * 2)
        .setInteractive()
        .on('pointerover', () => {
            starttext.setColor("#ff0000");
            this.showMessage("Click to strat your advanture.");
        })
        .on('pointerdown', () => {
            this.gotoScene('entrance');
        })
        .on('pointerout',()=>{
            starttext.setColor('#ffffff');
        });
    

        let credittext = this.add.text(this.w * 0.3, this.w * 0.425, "Credit")
        .setFontSize(this.s * 2)
        .setInteractive()
        .on('pointerover', () => {
            credittext.setColor("#ff0000");
            this.showMessage("Click to go to credit page.");
        })
        .on('pointerdown', () => {
            this.gotoScene('credit');
        })
        .on('pointerout',()=>{
            credittext.setColor('#ffffff');
        });

        let quittext = this.add.text(this.w * 0.3, this.w * 0.45, "Quit Game")
        .setFontSize(this.s * 2)
        .setInteractive()
        .on('pointerover', () => {
            quittext.setColor("#ff0000");
            this.showMessage("Click to quit game.");
        })
        .on('pointerdown', () => {
            window.close();
        })
        .on('pointerout',()=>{
            quittext.setColor('#ffffff');
        });
    }
}

class Entrance extends AdventureScene {

    constructor(){
        super("entrance","first scene");
    }

    onEnter(){
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}

class Credit extends AdventureScene{
    constructor(){
        super("credit","credit");
    }

    onEnter(){
        this.creditText = this.add.text(this.w * 0.3, this.h * 0.5,"Credit")
        .setFontSize(this.s *2);
    }
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro,Logo,Menu,Entrance,Credit, Demo1, Demo2, Outro],
    title: "Adventure Game",
});


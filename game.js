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
        this.add.text(50, 50, "Adventure awaits!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('logo'));
        });
    }
}

class Logo extends Phaser.Scene {
    constructor() {
        super("logo");
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("gamemaker", "gamemaker.png");
        this.load.audio('meow', 'funny-meow-110120.mp3');
    }

    create() {
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;
        var rotateAngle = 0;

        this.cameras.main.fadeIn(1000, 255, 255, 255);

        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);

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

        const logoBgm = this.sound.add('meow', { loop: false });

        logoBgm.play();

        this.input.on('pointerdown', () => {
            this.time.delayedCall(1000, () => {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
                this.time.delayedCall(2000, () => {
                    this.scene.start('Menu');
                });
            });
        });
    }
}

class Menu extends AdventureScene {

    constructor() {
        super("Menu", "Menu");
    }

    onEnter() {
        const starttext = this.add.text(this.w * 0.3, this.w * 0.4, "Start")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                starttext.setColor("#ff0000");
                this.showMessage("Click to strat your advanture.");
            })
            .on('pointerdown', () => {
                this.gotoScene('Entrance');
            })
            .on('pointerout', () => {
                starttext.setColor('#ffffff');
            });


        const credittext = this.add.text(this.w * 0.3, this.w * 0.425, "Credit")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                credittext.setColor("#ff0000");
                this.showMessage("Click to go to credit page.");
            })
            .on('pointerdown', () => {
                this.gotoScene('Credit');
            })
            .on('pointerout', () => {
                credittext.setColor('#ffffff');
            });

        const quittext = this.add.text(this.w * 0.3, this.w * 0.45, "Quit Game")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                quittext.setColor("#ff0000");
                this.showMessage("Click to quit game.");
            })
            .on('pointerdown', () => {
                window.close();
            })
            .on('pointerout', () => {
                quittext.setColor('#ffffff');
            });
    }
}

class Entrance extends AdventureScene {

    constructor() {
        super("Entrance", "Entrance");
    }

    onEnter() {
        const scroll = this.add.text(this.h * 0.5, this.h * 0.4, "📜 Scroll")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("Task: There is treasure in the cave, find it! (Click on object to interact.)");
            })
            .on("pointerdown", () => {
                this.showMessage("You cannot pick it!");
                this.tweens.add({
                    targets: scroll,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        const Lefthole = this.add.text(this.h * 0.2, this.h * 0.4, "<- 🕳️ A Hole")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("It's a hole!(Click to move forward.)");
            })
            .on("pointerdown", () => {
                this.time.delayedCall(1000, () => {
                    this.gotoScene("BossRoom");
                });
            });

        const Righthole = this.add.text(this.h * 0.8, this.h * 0.4, "🕳️ A Hole->")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("It's a hole!(Click to move forward.)");
            })
            .on("pointerdown", () => {
                this.time.delayedCall(1000, () => {
                    this.gotoScene("TreasureRoom");
                });
            });
    }
}

class BossRoom extends AdventureScene {

    constructor() {
        super("BossRoom", "Boss Room");
    }

    onEnter() {
        const monster = this.add.text(this.h / 2, this.h / 2, "👹 Ogre")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("A monster, but it didn't see you!(Click to attack.)")
            })
            .on("pointerdown", () => {
                if (this.hasItem("sword")) {
                    this.tweens.add({
                        targets: monster,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => {
                            monster.destroy();

                            const key = this.add.text(this.h * 0.5, this.h * 0.5, "🔑 key")
                                .setFontSize(this.s * 2)
                                .setAlpha(0)
                                .setInteractive()
                                .on("pointerover", () => {
                                    this.showMessage("This a key to open the chest!")
                                })
                                .on("pointerdown", () => {
                                    this.showMessage("You pick up the key.");
                                    this.gainItem('chest key');
                                    this.tweens.add({
                                        targets: key,
                                        y: `-=${2 * this.s}`,
                                        alpha: { from: 1, to: 0 },
                                        duration: 500,
                                        onComplete: () => key.destroy()
                                    });
                                });
                            this.tweens.add({
                                targets: key,
                                alpha: { from: 0, to: 1 },
                                duration: 500,
                                ease: "linear"
                            });
                        }
                    });
                }
                else {
                    this.showMessage("Unfortunately, you didn't defeat the monster.")
                    this.time.delayedCall(2000, () => {
                        this.gotoScene("Ending");
                    });
                }
            });

        let goToTreasureRoom = this.add.text(
            this.h / 2,
            this.h * 0.6,
            "🏃‍♂️ leave here"
        )
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("Click to go.");
            })
            .on("pointerdown", () => {
                this.gotoScene("TreasureRoom");
            });
    }
}

class TreasureRoom extends AdventureScene {

    constructor() {
        super("TreasureRoom", "Treasure Room")
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("chest", "chest-pixel.gif");
    }

    onEnter() {
        var cilckCounter = 0;

        let rat = this.add.text(
            this.h * 0.6,
            this.h * 0.5,
            "🐁"
        )
            .setFontSize(this.s * 2)
            .setAlpha(0)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("*Squeak*")
                this.tweens.add({
                    targets: rat,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on("pointerdown", () => {
                rat.destroy();
                this.showMessage("A powerful magic has teleported you away!");
                this.time.delayedCall(2000, () => {
                    this.gotoScene("SecretRoom");
                });
            });

        const chest = this.add.image(
            this.h / 2,
            this.h / 2,
            "chest"
        )
            .setScale(2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("A locked treasure chest!");
            })
            .on("pointerdown", () => {
                if (this.hasItem("chest key")) {
                    this.showMessage("You opened the treasure chest.");
                    this.loseItem("chest key");
                    this.gainItem("treasure");
                    this.time.delayedCall(2000, () => {
                        this.gotoScene("Ending");
                    });
                }
                else if (cilckCounter >= 3 && !this.hasItem("sword")) {
                    this.showMessage("A rat?");
                    rat.setAlpha(1);
                }
                else {
                    this.showMessage("You cannot open the chest without the key!");
                    cilckCounter += 1;
                }
            });

        let goToBossRoom = this.add.text(
            this.h / 2,
            this.h * 0.8,
            "Go to Boss Room"
        )
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("Click to move.");
            })
            .on("pointerdown", () => {
                this.gotoScene("BossRoom");
            });

    }
}

class SecretRoom extends AdventureScene {

    constructor() {
        super("SecretRoom", "Secret Room")
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("sword-image", "sword-pixel.gif");
    }

    onEnter() {
        if (!this.hasItem("sword")) {
            const sword = this.add.image(
                this.h / 2,
                this.h / 2,
                "sword-image"
            )
                .setScale(2)
                .setInteractive()
                .on("pointerover", () => {
                    this.showMessage("It's a powerful sword!");
                })
                .on("pointerdown", () => {
                    this.showMessage("You pick up the sword.");
                    this.gainItem("sword");
                    this.tweens.add({
                        targets: sword,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => sword.destroy()
                    });
                });
        }

        const backToTreasureRoom = this.add.text(
            this.h * 0.5,
            this.h * 0.6,
            "Back to Treasure Room"
        )
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("Click to back.")
            })
            .on("pointerdown", () => {
                this.gotoScene("TreasureRoom");
            });
    }
}

class Ending extends AdventureScene {
    constructor() {
        super("Ending", "The Ending")
    }

    onEnter() {
        if (this.hasItem("treasure")) {
            this.showMessage("Good Ending!");

            this.add.text(
                this.h / 2,
                this.h * 0.1,
                'Congratulations, \nyou successfully found the \ntreasure from the dungeon!\nThanks for playing.'
            )
                .setFontSize(this.s * 2);
        }
        else {
            this.showMessage("Bad Ending!");

            this.add.text(
                this.h / 2,
                this.h * 0.1,
                'Unfortunately,\nyour adventure ends here.\nThanks for playing.'
            )
                .setFontSize(this.s * 2);
        }

        this.add.text(
            this.h / 2,
            this.h * 0.75,
            "Back to Menu"
        )
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("Click to back to menu.")
            })
            .on("pointerdown", () => {
                this.gotoScene("Menu");
            });

        this.add.text(
            this.h / 2,
            this.h * 0.8,
            "Credit"
        )
            .setFontSize(this.s * 2)
            .setInteractive()
            .on("pointerover", () => {
                this.showMessage("Click to Credit.")
            })
            .on("pointerdown", () => {
                this.gotoScene("Credit");
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

class Credit extends AdventureScene {
    constructor() {
        super("Credit", "Credit");
    }

    onEnter() {
        this.creditText = this.add.text(this.h * 0.1, this.h * 0.1, 
`Credit
    Art: 
        All emoji are copied from: https://emojipedia.org/ 
        All images are made by me via Aseprite.
    Sound Effect:
        funny-meow-110120.mp3 
            -upload by u 8zlmcos31y 
            -from:https://pixabay.com/zh/sound-effects/funny-meow-110120/
`)
            .setFontSize(this.s * 2)
            .setWordWrapWidth(this.s * 100);
    }
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro, Logo, Menu, Entrance, BossRoom, TreasureRoom, SecretRoom, Ending, Credit, Demo1, Demo2, Outro],
    title: "Adventure Game",
});


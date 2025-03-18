import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('teleporter', 'assets/win.png') //load teleporter png
        this.load.spritesheet('dude', 'assets/issac.png',
            { frameWidth: 32, frameHeight: 35 }
        );
    }


    teleporters: any;
    platforms: any;
    lava: any;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: any;
    stars: any;
    score = 0;
    scoreText: any;
    immunityFrames = 0;
    level = 0;
    collectStar(_player: any, star: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    lavaHurt(_player: any, _lava: Phaser.Types.Physics.Arcade.SpriteWithStaticBody) {
        if (this.immunityFrames <= 0) {
            this.score -= 10;
            this.scoreText.setText('Score: ' + this.score);
            this.immunityFrames = 60;


        }

    }

    teleportTouch(_player: any, _teleporters: Phaser.Types.Physics.Arcade.SpriteWithStaticBody) { //over here is where we need to teleport to the new map
        this.scoreText.setText('Score: ' + this.score + ' TELEPORT');
        this.level = 1;
        this.player.body.reset(0,0); // Coords for players position after teleporting
    }

    create() {
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.add.image(400, 300, 'sky')

        this.platforms = this.physics.add.staticGroup();
        this.lava = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        this.lava.create(300, 300, 'lava');

        this.teleporters = this.physics.add.staticGroup();
        this.teleporters.create(750, 120, "teleporter")

        this.player = this.physics.add.sprite(100, 450, 'dude');

        //this. player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);



        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'lavaBurn',
            frames: [{ key: 'dude', frame: 9 }],
            frameRate: 10,
        });



        this.player.body.setGravityY(300)

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });


        this.scoreText = this.add.text(0, 0, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.stars, this.lava);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
        this.physics.add.collider(this.player, this.lava, this.lavaHurt, undefined, this);
        this.physics.add.collider(this.player, this.teleporters, this.teleportTouch, undefined, this)
    }   


    update() {
        if (this.immunityFrames > 0) {
            this.immunityFrames--;
        }


        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            if (this.immunityFrames > 30) {
                this.player.anims.play('lavaBurn');
            } else {
                this.player.anims.play('turn');
            }
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-600);
        }




    }


}


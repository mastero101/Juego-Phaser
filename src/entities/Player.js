class Player {
    constructor(scene) {
        this.scene = scene;
        this.sprite = null;
        this.isInWater = false;
    }

    create(x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'playerIdle');
        this.sprite.setScale(2);
        this.sprite.setDepth(1);
        
        this.scene.anims.create({
            key: 'walk',
            frames: [
                { key: 'playerIdle' },
                { key: 'playerWalk1' },
                { key: 'playerWalk2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        return this.sprite;
    }

    update(cursors, wasd, isMenuOpen) {
        if (isMenuOpen) {
            this.sprite.setVelocity(0, 0);
            return;
        }

        const baseSpeed = 160;
        const speed = this.isInWater ? baseSpeed * 0.5 : baseSpeed;
        this.isInWater = false;

        let velocityX = 0;
        let velocityY = 0;

        if (cursors.left.isDown || wasd.left.isDown) {
            velocityX = -speed;
            this.sprite.setFlipX(true);
        } else if (cursors.right.isDown || wasd.right.isDown) {
            velocityX = speed;
            this.sprite.setFlipX(false);
        }

        if (cursors.up.isDown || wasd.up.isDown) {
            velocityY = -speed;
        } else if (cursors.down.isDown || wasd.down.isDown) {
            velocityY = speed;
        }

        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        this.sprite.setVelocity(velocityX, velocityY);

        if (velocityX !== 0 || velocityY !== 0) {
            this.sprite.anims.play('walk', true);
        } else {
            this.sprite.setTexture('playerIdle');
            this.sprite.anims.stop();
        }
    }

    handleWaterCollision() {
        this.isInWater = true;
    }
}
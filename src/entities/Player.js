class Player {
    constructor(scene) {
        this.scene = scene;
        this.sprite = null;
        this.isInWater = false;
        this.level = 1;
        this.experience = 0;
        this.strength = 10;
        this.defense = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.mana = 50;
        this.maxMana = 50;

        // Load stats from local storage if available
        this.loadStats();
    }

    levelUp() {
        this.level += 1;
        this.maxHealth += 20; // Increase max health by 20
        this.health = this.maxHealth; // Restore health to max
        this.maxMana += 20; // Increase max mana by 20
        this.mana = this.maxMana; // Restore mana to max

        // Save updated stats to local storage
        this.saveStats();
    }

    saveStats() {
        const stats = {
            level: this.level,
            experience: this.experience,
            strength: this.strength,
            defense: this.defense,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana: this.maxMana,
            // Add other stats as needed
        };
        localStorage.setItem('playerStats', JSON.stringify(stats));
    }

    loadStats() {
        const savedStats = localStorage.getItem('playerStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            this.level = stats.level;
            this.experience = stats.experience;
            this.strength = stats.strength;
            this.defense = stats.defense;
            // Load other stats as needed
        }
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

    updateWithMobileControls(mobileInput) {
        const speed = 200;

        if (mobileInput.left) {
            this.sprite.setVelocityX(-speed);
            this.sprite.flipX = true;
        } else if (mobileInput.right) {
            this.sprite.setVelocityX(speed);
            this.sprite.flipX = false;
        }

        if (mobileInput.up) {
            this.sprite.setVelocityY(-speed);
        } else if (mobileInput.down) {
            this.sprite.setVelocityY(speed);
        }

        // Normalize diagonal movement
        if (this.sprite.body.velocity.x !== 0 && this.sprite.body.velocity.y !== 0) {
            this.sprite.body.velocity.normalize().scale(speed);
        }
    }

    gainExperience(amount) {
        this.experience += amount;
        if (this.experience >= this.nextLevelExperience()) {
            this.levelUp();
        }
        this.saveStats(); // Save stats after gaining experience
    }

    levelUp() {
        this.level++;
        this.experience = 0; // Reset experience or carry over excess
        this.maxHealth += 20; // Example stat increase
        this.health = this.maxHealth; // Restore health to max
        this.strength += 2; // Example stat increase
        this.defense += 1; // Example stat increase
        // Add any additional stat increases or effects here
        this.saveStats(); // Save stats after leveling up
    }

    nextLevelExperience() {
        return this.level * 100; // Example calculation for next level
    }
}
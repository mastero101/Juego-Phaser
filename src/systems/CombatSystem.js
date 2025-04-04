class CombatSystem {
    constructor(scene) {
        this.scene = scene;
        this.player = scene.player;
        this.attackCooldown = false;
        this.attackDuration = 300;
        this.attackRange = 50;
        this.baseDamage = 20;
        
        // Initialize player health if not exists
        if (!this.player.health) {
            this.player.health = 100;
            this.player.maxHealth = 100;
        }
        
        // Create sword sprite
        this.sword = scene.add.sprite(0, 0, 'sword')
            .setOrigin(0.5, 1)
            .setScale(1)
            .setDepth(5)
            .setVisible(false);
    }

    initialize() {
        // Attack key setup
        this.attackKey = this.scene.input.keyboard.addKey('SPACE');
        this.attackKey.on('down', () => {
            if (!this.attackCooldown) {
                this.performAttack();
            }
        });

        // Movement keys
        this.keys = this.scene.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });
    }

    update() {
        if (!this.player || !this.player.sprite) return;

        const speed = 200;
        const sprite = this.player.sprite;

        // Reset velocity
        sprite.setVelocity(0);

        // Horizontal movement
        if (this.keys.left.isDown) {
            sprite.setVelocityX(-speed);
            sprite.flipX = true;
        } else if (this.keys.right.isDown) {
            sprite.setVelocityX(speed);
            sprite.flipX = false;
        }

        // Vertical movement
        if (this.keys.up.isDown) {
            sprite.setVelocityY(-speed);
        } else if (this.keys.down.isDown) {
            sprite.setVelocityY(speed);
        }

        // Normalize diagonal movement
        if (sprite.body.velocity.x !== 0 && sprite.body.velocity.y !== 0) {
            sprite.body.velocity.normalize().scale(speed);
        }

        // Update enemy health bars positions
        if (this.scene.enemySystem?.enemies) {
            this.scene.enemySystem.enemies.forEach(enemy => {
                if (enemy.healthBar) {
                    enemy.healthBar.clear();
                    enemy.healthBar.fillStyle(0xff0000);
                    enemy.healthBar.fillRect(enemy.x - 15, enemy.y - 25, 30 * (enemy.health / enemy.maxHealth), 4);
                }
            });
        }
    }

    checkEnemyHits() {
        // Ensure enemySystem and enemies array exists and is valid
        if (!this.scene.enemySystem?.enemies || !Array.isArray(this.scene.enemySystem.enemies.getChildren())) {
            return;
        }

        // Now safely iterate through enemies
        this.scene.enemySystem.enemies.getChildren().forEach(enemy => {
            if (!enemy) return; // Skip if enemy is invalid
            
            const distance = Phaser.Math.Distance.Between(
                this.sword.x, this.sword.y,
                enemy.x, enemy.y
            );
            
            if (distance <= this.attackRange) {
                this.dealDamage(enemy);
            }
        });
    }

    performAttack() {
        if (this.attackCooldown) return;
        this.attackCooldown = true;

        const direction = this.player.sprite.flipX ? -1 : 1;
        
        // Position and show sword
        this.sword.setPosition(
            this.player.sprite.x + (25 * direction),
            this.player.sprite.y
        );
        this.sword.setVisible(true);
        this.sword.setFlipX(direction === -1);

        // Create slash effect and check hits
        const slash = this.scene.add.sprite(
            this.player.sprite.x + (40 * direction),
            this.player.sprite.y,
            'slash'
        )
        .setAlpha(0.8)
        .setScale(0.1)
        .setAngle(direction === 1 ? -45 : 225)
        .setDepth(this.player.sprite.depth + 1);

        // Animate slash
        this.scene.tweens.add({
            targets: slash,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: this.attackDuration,
            ease: 'Power2',
            onComplete: () => {
                slash.destroy();
                // Reset attack cooldown here
                this.attackCooldown = false;
            }
        });

        // Check for hits
        this.checkEnemyHits();

        // Sword swing animation
        this.scene.tweens.add({
            targets: this.sword,
            angle: direction === 1 ? 130 : -130,
            duration: this.attackDuration,
            ease: 'Power1',
            onStart: () => {
                this.sword.setAngle(direction === 1 ? -45 : 45);
            },
            onComplete: () => {
                this.sword.setAngle(0);
                this.sword.setVisible(false);
            }
        });
    }

    dealDamage(enemy) {
        if (!enemy.health) {
            enemy.health = 100;
            enemy.maxHealth = 100;
            
            // Create health bar container
            enemy.healthBarContainer = this.scene.add.container(enemy.x, enemy.y - 25);
            enemy.healthBarContainer.setDepth(1000);

            // Background bar (gray)
            enemy.healthBarBg = this.scene.add.rectangle(-15, 0, 30, 4, 0x333333);
            // Health bar (red)
            enemy.healthBar = this.scene.add.rectangle(-15, 0, 30, 4, 0xff0000);
            // Health text
            enemy.healthText = this.scene.add.text(0, -10, '100/100', {
                font: '10px Arial',
                fill: '#ffffff'
            }).setOrigin(0.5, 0);
            
            enemy.healthBarContainer.add([enemy.healthBarBg, enemy.healthBar, enemy.healthText]);
        }
        
        const damage = this.baseDamage;
        enemy.health = Math.max(0, enemy.health - damage);

        // Update health bar and text
        const healthPercent = enemy.health / enemy.maxHealth;
        enemy.healthBar.width = 30 * healthPercent;
        enemy.healthText.setText(`${Math.ceil(enemy.health)}/${enemy.maxHealth}`);
        
        // Create slash effect at hit position
        const slash = this.scene.add.sprite(enemy.x, enemy.y, 'slash')
            .setAlpha(0.7)
            .setScale(0.5)
            .setDepth(enemy.depth + 1);

        this.scene.tweens.add({
            targets: slash,
            alpha: 0,
            scale: 1,
            duration: 300,
            onComplete: () => slash.destroy()
        });

        // Create enhanced hit effect
        const hitEffect = this.scene.add.sprite(enemy.x, enemy.y, 'slash')
            .setAlpha(1)
            .setScale(0.4)
            .setTint(0xFF0000)  // Red tint
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(enemy.depth + 1);

        this.scene.tweens.add({
            targets: hitEffect,
            alpha: 0,
            scale: 1.5,
            angle: 360,  // Full rotation
            duration: 400,
            ease: 'Power2',
            onComplete: () => hitEffect.destroy()
        });

        // Visual feedback
        enemy.setTint(0xff0000);
        
        // Damage text
        const damageText = this.scene.add.text(
            enemy.x, 
            enemy.y - 20, 
            `-${damage}`, 
            {
                font: '16px Arial',
                fill: '#ff0000'
            }
        ).setDepth(1000).setOrigin(0.5, 0);

        // Animate damage text
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => damageText.destroy()
        });

        // Reset enemy tint
        this.scene.time.delayedCall(100, () => {
            enemy.clearTint();
        });

        // Check if enemy is defeated
        if (enemy.health <= 0) {
            if (enemy.healthBarContainer) enemy.healthBarContainer.destroy();
            this.scene.enemySystem.enemies.remove(enemy, true, true);
        }
    }

    update() {
        if (!this.player || !this.player.sprite) return;

        const speed = 200;
        const sprite = this.player.sprite;

        // Reset velocity
        sprite.setVelocity(0);

        // Horizontal movement
        if (this.keys.left.isDown) {
            sprite.setVelocityX(-speed);
            sprite.flipX = true;
        } else if (this.keys.right.isDown) {
            sprite.setVelocityX(speed);
            sprite.flipX = false;
        }

        // Vertical movement
        if (this.keys.up.isDown) {
            sprite.setVelocityY(-speed);
        } else if (this.keys.down.isDown) {
            sprite.setVelocityY(speed);
        }

        // Normalize diagonal movement
        if (sprite.body.velocity.x !== 0 && sprite.body.velocity.y !== 0) {
            sprite.body.velocity.normalize().scale(speed);
        }

        // Update health bars positions
        if (this.scene.enemySystem?.enemies) {
            this.scene.enemySystem.enemies.forEach(enemy => {
                if (enemy.healthBarContainer) {
                    enemy.healthBarContainer.setPosition(enemy.x, enemy.y - 25);
                }
            });
        }
    }
}
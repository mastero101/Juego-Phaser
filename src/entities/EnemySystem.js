class EnemySystem {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
        this.damageCooldown = false; // Add damage cooldown property
    }

    create() {
        // Ensure collision is set up between player and enemies
        this.scene.physics.add.collider(this.scene.player.sprite, this.enemies, this.handleEnemyCollision, null, this);
        this.scene.physics.add.collider(this.enemies, this.scene.mapGenerator.treeTiles);
        this.scene.physics.add.collider(this.enemies, this.enemies);
        
        this.spawnEnemies();
    }

    handleEnemyCollision(player, enemy) {
        if (this.damageCooldown) return; // Skip if cooldown is active

        const enemyDamage = enemy.getData('damage');
        
        // Calculate reduced damage based on player's defense
        const playerDefense = this.scene.player.defense;
        const defenseReduction = Math.max(0, (playerDefense - 5) * 0.01); // 2% reduction per defense point above 5
        const reducedDamage = enemyDamage * (1 - defenseReduction);

        // Apply the reduced damage to the player's health
        this.scene.playerStats.health = Math.max(0, this.scene.playerStats.health - reducedDamage);

        // Log the damage dealt to the player
        console.log(`Player Defense: ${playerDefense}`);
        console.log(`Damage dealt to player: ${reducedDamage}`);

        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        player.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);

        // Set damage cooldown
        this.damageCooldown = true;
        this.scene.time.delayedCall(1000, () => {
            this.damageCooldown = false; // Reset cooldown after 1 second
        });
    }

    spawnEnemies() {
        const enemyTypes = Object.keys(this.scene.enemyTypes);
        
        for (let i = 0; i < 10; i++) {
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const x = Phaser.Math.Between(100, 1500);
            const y = Phaser.Math.Between(100, 1500);
            
            const enemy = this.enemies.create(x, y, type);
            enemy.setData('type', type);
            enemy.setData('health', this.scene.enemyTypes[type].health);
            enemy.setData('damage', this.scene.enemyTypes[type].damage);
            enemy.setData('speed', this.scene.enemyTypes[type].speed);
            enemy.setData('experience', this.scene.enemyTypes[type].experience);
        }
    }

    update() {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                const distance = Phaser.Math.Distance.Between(
                    enemy.x, enemy.y,
                    this.scene.player.sprite.x, 
                    this.scene.player.sprite.y
                );
                
                if (distance < 200) {
                    const angle = Phaser.Math.Angle.Between(
                        enemy.x, enemy.y,
                        this.scene.player.sprite.x, 
                        this.scene.player.sprite.y
                    );
                    
                    const speed = enemy.getData('speed');
                    enemy.setVelocity(
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    );
                } else {
                    enemy.setVelocity(0, 0);
                }
            }
        });
    }
}
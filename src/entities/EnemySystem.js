class EnemySystem {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
    }

    create() {
        this.scene.physics.add.collider(this.scene.player.sprite, this.enemies, this.handleEnemyCollision, null, this);
        this.scene.physics.add.collider(this.enemies, this.scene.mapGenerator.treeTiles);
        this.scene.physics.add.collider(this.enemies, this.enemies);
        
        this.spawnEnemies();
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

    handleEnemyCollision(player, enemy) {
        const damage = enemy.getData('damage');
        this.scene.playerStats.health = Math.max(0, this.scene.playerStats.health - damage);
        
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        player.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
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
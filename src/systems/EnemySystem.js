class EnemySystem {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.containers = new Map();  // Changed to Map for better container management
        this.enemyGroup = null;
    }

    create() {
        // Initialize containers first
        this.initializeContainers();
        
        // Initialize physics group for enemies
        this.enemyGroup = this.scene.physics.add.group();
        
        // Create initial enemies
        this.spawnEnemies();
        
        // Setup collisions with player
        if (this.scene.player && this.scene.player.sprite) {
            this.scene.physics.add.collider(
                this.scene.player.sprite,
                this.enemyGroup
            );
        }
    }

    initializeContainers() {
        // Initialize container for each enemy type
        Object.keys(this.scene.enemyTypes).forEach(type => {
            this.containers.set(type, this.scene.add.container(0, 0));
        });
    }

    spawnEnemies() {
        // Clear existing arrays if needed
        this.enemies = [];

        // Create enemies here...
        Object.keys(this.scene.enemyTypes).forEach(type => {
            const container = this.containers.get(type);
            if (!container) return;

            // Create enemy sprite
            const enemy = this.enemyGroup.create(
                Phaser.Math.Between(100, 1500),
                Phaser.Math.Between(100, 1500),
                type
            );
            
            // Setup enemy properties
            enemy.type = type;
            enemy.setCollideWorldBounds(true);
            
            // Add to container and tracking array
            container.add(enemy);
            this.enemies.push(enemy);
        });
    }

    update() {
        if (this.enemies && Array.isArray(this.enemies)) {
            this.enemies.forEach(enemy => {
                // Enemy update logic here
            });
        }
    }
}
class MapGenerator {
    constructor(scene) {
        this.scene = scene;
        this.waterTiles = null;
        this.treeTiles = null;
        this.mapContainer = null;
        this.wallsContainer = null;
    }

    create() {
        try {
            // Create containers first
            this.mapContainer = this.scene.add.container(0, 0);
            this.wallsContainer = this.scene.add.container(0, 0);
            
            // Then create physics groups
            this.waterTiles = this.scene.physics.add.staticGroup();
            this.treeTiles = this.scene.physics.add.staticGroup();
            
            return true;
        } catch (error) {
            console.error('Failed to initialize MapGenerator:', error);
            return false;
        }
    }

    generate() {
        // Only proceed if create() succeeds
        if (this.create()) {
            this.generateMap();
        }
    }

    generateMap() {
        // Asegurarnos de inicializar primero
        this.create();

        if (!this.mapContainer || !this.wallsContainer) {
            console.error('Containers not initialized');
            return;
        }

        // Generar capa base de pasto
        this.generateBaseLayer();
        
        // Generar elementos del mundo
        this.generateWorldFeatures();
        
        // Generar caminos aleatorios
        this.generateRandomPaths();
    }

    generateBaseLayer() {
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tileX = x * 32;
                const tileY = y * 32;

                const grass = this.scene.add.image(tileX, tileY, 'grass');
                grass.setOrigin(0);
                this.mapContainer.add(grass);
            }
        }
    }

    generateWorldFeatures() {
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tileX = x * 32;
                const tileY = y * 32;
                
                // Mejorado el sistema de ruido para más variedad
                const noise = (Math.sin(x * 0.3) * Math.cos(y * 0.2) + 
                             Math.sin(x * 0.1) * Math.cos(y * 0.4) +
                             Math.random() * 0.3);

                if (noise > 0.6) {
                    const tree = this.treeTiles.create(tileX, tileY, 'tree');
                    tree.setOrigin(0);
                    tree.body.setSize(16, 16);
                    tree.body.setOffset(8, 16);
                    this.wallsContainer.add(tree);
                } else if (noise < -0.6) {
                    const water = this.waterTiles.create(tileX, tileY, 'water');
                    water.setOrigin(0);
                    this.wallsContainer.add(water);
                }
            }
        }
    }

    generateRandomPaths() {
        const pathCount = 3;
        for (let i = 0; i < pathCount; i++) {
            let x = Math.floor(Math.random() * 50);
            let y = Math.floor(Math.random() * 50);

            for (let step = 0; step < 50; step++) {
                const path = this.scene.add.image(x * 32, y * 32, 'path');
                path.setOrigin(0);
                this.mapContainer.add(path);

                const direction = Math.floor(Math.random() * 4);
                switch(direction) {
                    case 0: x++; break;
                    case 1: x--; break;
                    case 2: y++; break;
                    case 3: y--; break;
                }

                x = Phaser.Math.Clamp(x, 0, 49);
                y = Phaser.Math.Clamp(y, 0, 49);
            }
        }
    }

    setupCollisions() {
        this.scene.physics.add.overlap(
            this.scene.player.sprite, 
            this.waterTiles, 
            () => this.scene.player.handleWaterCollision(), 
            null, 
            this
        );

        this.scene.physics.add.collider(
            this.scene.player.sprite, 
            this.treeTiles
        );
    }
}
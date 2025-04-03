class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // We'll create the character in create() method
    }

    create() {
        const graphics = this.add.graphics();
        
        // Create textures
        this.createTileTextures();
        
        // Create physics groups
        this.waterTiles = this.physics.add.staticGroup();
        this.treeTiles = this.physics.add.staticGroup();
        
        // Generate random map
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tileX = x * 32;
                const tileY = y * 32;
                
                // Base grass everywhere
                const grass = this.add.image(tileX, tileY, 'grass');
                grass.setOrigin(0);
                
                const noise = Math.sin(x * 0.2) * Math.cos(y * 0.2) + Math.random() * 0.4;
                
                if (noise > 0.6) {
                    const tree = this.treeTiles.create(tileX, tileY, 'tree');
                    tree.setOrigin(0);
                    tree.body.setSize(16, 16);  // Ajustar hitbox
                    tree.body.setOffset(8, 16);  // Mover hitbox a la base del árbol
                } else if (noise < -0.6) {
                    const water = this.waterTiles.create(tileX, tileY, 'water');
                    water.setOrigin(0);
                } else if (noise > 0.2 && noise < 0.4) {
                    const path = this.add.image(tileX, tileY, 'path');
                    path.setOrigin(0);
                }
            }
        }

        // Create player and setup
        this.createCharacterTexture(graphics, 'playerIdle', false);
        this.createCharacterTexture(graphics, 'playerWalk1', true);
        this.createCharacterTexture(graphics, 'playerWalk2', false);
        
        this.player = this.physics.add.sprite(400, 300, 'playerIdle');
        this.player.setScale(2);
        this.player.setDepth(1);
        
        // Add water overlap detection
        this.physics.add.overlap(this.player, this.waterTiles, this.handleWaterMovement, null, this);
        
        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Setup animations
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'playerIdle' },
                { key: 'playerWalk1' },
                { key: 'playerWalk2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Setup camera
        this.cameras.main.startFollow(this.player, true);

        // Add collisions and overlaps
        this.physics.add.collider(this.player, this.treeTiles);
        this.physics.add.overlap(this.player, this.waterTiles, this.handleWaterMovement, null, this);
    }

    update() {
        const baseSpeed = 160;
        const speed = this.isInWater ? baseSpeed * 0.5 : baseSpeed;
        this.isInWater = false;  // Reset water state each frame
        
        let velocityX = 0;
        let velocityY = 0;

        // Calculate movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocityX = -speed;
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocityX = speed;
            this.player.setFlipX(false);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocityY = -speed;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocityY = speed;
        }

        // Apply diagonal movement normalization
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        // Apply movement
        this.player.setVelocity(velocityX, velocityY);

        // Animation control
        if (velocityX !== 0 || velocityY !== 0) {
            this.player.anims.play('walk', true);
        } else {
            this.player.setTexture('playerIdle');
            this.player.anims.stop();
        }
    }

    handleWaterMovement(player, water) {
        this.isInWater = true;
    }

    createCharacterTexture(graphics, textureName, isStepFrame) {
        graphics.clear();

        const colors = {
            helmet: 0x808080,
            helmetShade: 0x606060,
            hood: 0x8B0000,      
            hoodShade: 0x660000,
            skin: 0xFFD1B3,      
            clothes: 0x228B22,   
            clothesShade: 0x006400,
            belt: 0x8B4513,      
            beltBuckle: 0xDAA520,
            woodenSword: 0xDEB887,
            woodenSwordShade: 0xCD853F,  // Darker wood for shading
            woodenHandle: 0x8B4513,
            handleWrap: 0x654321,        // Dark brown for handle wrapping
            guardColor: 0xB8860B         // Dark golden for sword guard
        };

        // Helmet
        graphics.fillStyle(colors.helmet);
        graphics.fillRect(6, 0, 20, 6);
        graphics.fillStyle(colors.helmetShade);
        graphics.fillRect(6, 0, 4, 6);

        // Hood under helmet
        graphics.fillStyle(colors.hood);
        graphics.fillRect(6, 6, 20, 10);
        graphics.fillStyle(colors.hoodShade);
        graphics.fillRect(6, 6, 4, 10);
        
        // Face
        graphics.fillStyle(colors.skin);
        graphics.fillRect(10, 8, 12, 8);
        
        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillRect(12, 10, 2, 2);
        graphics.fillRect(18, 10, 2, 2);

        // Clothes
        graphics.fillStyle(colors.clothes);
        graphics.fillRect(8, 16, 16, 12);
        graphics.fillStyle(colors.clothesShade);
        graphics.fillRect(8, 16, 4, 12);

        // Hands
        graphics.fillStyle(colors.skin);
        graphics.fillRect(6, 20, 4, 4);  // Left hand
        graphics.fillRect(22, 20, 4, 4); // Right hand

        // Belt
        graphics.fillStyle(colors.belt);
        graphics.fillRect(8, 24, 16, 4);
        graphics.fillStyle(colors.beltBuckle);
        graphics.fillRect(14, 25, 4, 2);

        // Wooden Sword (adjusted position)
        graphics.fillStyle(colors.woodenHandle);
        graphics.fillRect(26, 18, 3, 6); // Handle
        graphics.fillStyle(colors.woodenSword);
        graphics.fillRect(26, 8, 3, 10);  // Blade longer and wider

        // Shoes
        graphics.fillStyle(colors.shoes);
        if (isStepFrame) {
            // Walking frame 1 - feet apart
            graphics.fillRect(8, 28, 6, 4);  // Left shoe
            graphics.fillRect(18, 28, 6, 4); // Right shoe
        } else {
            // Standing or Walking frame 2 - feet together
            graphics.fillRect(11, 28, 5, 4);  // Left shoe
            graphics.fillRect(16, 28, 5, 4); // Right shoe
        }

        graphics.generateTexture(textureName, 32, 32);
        graphics.clear();
    }

    createTileTextures() {
        const graphics = this.add.graphics();
        const tileSize = 32;

        // Grass tile
        graphics.clear();
        graphics.fillStyle(0x2E8B57);  // Base green
        graphics.fillRect(0, 0, tileSize, tileSize);
        // Add grass details
        graphics.fillStyle(0x3CB371);
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * tileSize;
            const y = Math.random() * tileSize;
            graphics.fillRect(x, y, 2, 4);
        }
        graphics.generateTexture('grass', tileSize, tileSize);

        // Tree tile
        graphics.clear();
        graphics.fillStyle(0x8B4513);  // Trunk
        graphics.fillRect(12, 16, 8, 16);
        graphics.fillStyle(0x228B22);  // Leaves
        graphics.fillRect(6, 4, 20, 16);
        graphics.generateTexture('tree', tileSize, tileSize);

        // Water tile
        graphics.clear();
        graphics.fillStyle(0x4169E1);  // Base water
        graphics.fillRect(0, 0, tileSize, tileSize);
        graphics.fillStyle(0x87CEEB);  // Water highlights
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * tileSize;
            const y = Math.random() * tileSize;
            graphics.fillRect(x, y, 4, 2);
        }
        graphics.generateTexture('water', tileSize, tileSize);

        // Path tile
        graphics.clear();
        graphics.fillStyle(0xDEB887);  // Base path
        graphics.fillRect(0, 0, tileSize, tileSize);
        graphics.fillStyle(0xD2691E);  // Path details
        for (let i = 0; i < 6; i++) {
            const x = Math.random() * tileSize;
            const y = Math.random() * tileSize;
            graphics.fillRect(x, y, 3, 3);
        }
        graphics.generateTexture('path', tileSize, tileSize);

        graphics.clear();
    }

    createProceduralMap() {
        const mapWidth = 50;
        const mapHeight = 50;
        
        // Create container for map tiles
        this.mapContainer = this.add.container(0, 0);
        this.wallsContainer = this.add.container(0, 0);
        
        // Generate base terrain
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tileX = x * 32;
                const tileY = y * 32;
                
                // Add grass everywhere as base
                const grass = this.add.image(tileX, tileY, 'grass');
                grass.setOrigin(0);
                this.mapContainer.add(grass);
                
                // Random features
                const rand = Math.random();
                if (rand < 0.05) {  // 5% chance for trees
                    const tree = this.add.image(tileX, tileY, 'tree');
                    tree.setOrigin(0);
                    this.wallsContainer.add(tree);
                    // Add physics body for collision
                    this.physics.add.existing(tree, true);
                } else if (rand < 0.08) {  // 3% chance for water
                    const water = this.add.image(tileX, tileY, 'water');
                    water.setOrigin(0);
                    this.wallsContainer.add(water);
                    // Add physics body for collision
                    this.physics.add.existing(water, true);
                }
            }
        }

        // Generate paths
        this.generatePaths();
    }

    generatePaths() {
        const pathCount = 3;
        for (let i = 0; i < pathCount; i++) {
            let x = Math.floor(Math.random() * 50);
            let y = Math.floor(Math.random() * 50);
            
            for (let step = 0; step < 50; step++) {
                const path = this.add.image(x * 32, y * 32, 'path');
                path.setOrigin(0);
                this.mapContainer.add(path);
                
                // Random direction
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
}
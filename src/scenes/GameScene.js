class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.playerStats = {...initialPlayerStats};
        this.enemyTypes = enemyTypes;
        this.player = null;
        this.worldSize = {
            width: 50,
            height: 50,
            tileSize: 32
        };
    }

    create() {
        // First, create textures and initialize containers
        const graphics = this.add.graphics();
        createTileTextures(this);
        createCharacterTexture(this, 'playerIdle', false);
        createCharacterTexture(this, 'playerWalk1', true);
        createCharacterTexture(this, 'playerWalk2', false);
        createEnemyTextures(this, this.enemyTypes);
        
        // Create slash effect texture
        if (!this.textures.exists('slash')) {
            const slashGraphics = this.add.graphics();
            slashGraphics.lineStyle(3, 0xFFFFFF, 0.8);
            slashGraphics.beginPath();
            slashGraphics.arc(32, 32, 24, 0, Math.PI, true);
            slashGraphics.strokePath();
            slashGraphics.generateTexture('slash', 64, 64);
            slashGraphics.destroy();
        }
        
        // Initialize containers for map generation
        this.containers = {
            ground: this.add.container(0, 0),
            objects: this.add.container(0, 0),
            entities: this.add.container(0, 0)
        };

        // Create map first but don't setup collisions yet
        this.mapGenerator = new MapGenerator(this, this.containers); // Pass containers here
        this.mapGenerator.generateMap();

        graphics.destroy();

        // Then setup world physics
        this.physics.world.setBounds(0, 0, 
            this.worldSize.width * this.worldSize.tileSize, 
            this.worldSize.height * this.worldSize.tileSize
        );

        // Setup camera before creating entities
        this.setupCamera();

        // Create map first but don't setup collisions yet
        this.mapGenerator = new MapGenerator(this);
        this.mapGenerator.generateMap(); // Only generate the map tiles

        // Create player before enemy system
        this.player = new Player(this);
        const playerSprite = this.player.create(400, 300);
        playerSprite.setCollideWorldBounds(true);

        // Now setup map collisions after player exists
        this.mapGenerator.setupCollisions();

        // Setup camera follow
        this.cameras.main.startFollow(playerSprite, true, 0.09, 0.09);
        this.cameras.main.setZoom(1.2);

        // Create enemy system after player exists
        this.enemySystem = new EnemySystem(this);
        this.enemySystem.create();

        // Asegurarnos de que enemies existe y es un array antes de usar forEach
        if (this.enemySystem.enemies && Array.isArray(this.enemySystem.enemies)) {
            this.enemySystem.enemies.forEach(enemy => {
                enemy.nameTag = createEnemyNameTag(this, enemy.x, enemy.y, enemy.type);
            });
        }

        // Create UI elements last
        this.statusMenu = new StatusMenu(this);
        this.statusMenu.create();

        // Create water effects before setting up events
        this.createWaterEffects();

        // Setup controls and events
        this.setupControls();
        this.setupKeyboardEvents();

        // Crear barras de salud y maná en la parte superior derecha
        this.createTopRightBars();

        // Initialize combat system after player and enemy system are created
        this.combatSystem = new CombatSystem(this);
        this.combatSystem.initialize();

        // Add mobile controls if on touch device
        this.mobileControls = new MobileControls(this);

        // Detect orientation change
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    }

    handleOrientationChange() {
        const orientation = window.screen.orientation.type;
        if (orientation.includes('landscape')) {
            this.scale.resize(window.innerWidth, window.innerHeight);
            this.cameras.main.setBounds(0, 0, this.worldSize.width * this.worldSize.tileSize, this.worldSize.height * this.worldSize.tileSize);
            this.cameras.main.setZoom(1); // Ensure zoom is set to 1 for full screen
        } else if (orientation.includes('portrait')) {
            this.scale.resize(600, 800); // Example portrait size
            this.cameras.main.setBounds(0, 0, 600, 800);
        }
        this.cameras.main.centerOn(this.player.sprite.x, this.player.sprite.y);
    }

    createWaterEffects() {
        if (!this.textures.exists('water')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x4dabf7, 0.6);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('water', 8, 8);
            graphics.destroy();
        }

        // Nuevo sistema de partículas
        this.waterEffect = {
            particles: [],
            maxParticles: 10,
            timer: 0,
            
            create: (scene, x, y) => {
                const particle = scene.add.image(x, y, 'water')
                    .setAlpha(0.5)
                    .setScale(0.2);
                
                this.waterEffect.particles.push(particle); // Mover antes de la animación

                scene.tweens.add({
                    targets: particle,
                    alpha: 0,
                    scale: 0,
                    duration: 1000,
                    onComplete: () => {
                        this.waterEffect.particles = this.waterEffect.particles.filter(p => p !== particle);
                        particle.destroy();
                    }
                });
            },

            start: (x, y) => {
                this.waterEffect.active = true;
                this.waterEffect.x = x;
                this.waterEffect.y = y;
            },

            stop: () => {
                this.waterEffect.active = false;
            },

            update: (scene, delta) => {
                if (!this.waterEffect.active) return;

                this.waterEffect.timer += delta;
                if (this.waterEffect.timer > 100) {
                    this.waterEffect.timer = 0;
                    if (this.waterEffect.particles.length < this.waterEffect.maxParticles) {
                        const offsetX = (Math.random() - 0.5) * 20;
                        const offsetY = (Math.random() - 0.5) * 20;
                        this.waterEffect.create(
                            scene, 
                            this.waterEffect.x + offsetX, 
                            this.waterEffect.y + offsetY
                        );
                    }
                }
            }
        };
    }

    update(time, delta) {
        this.player.update(this.cursors, this.wasd, this.statusMenu.visible);
        this.enemySystem.update();
        
        // Verificar que enemies existe antes de actualizar etiquetas
        if (this.enemySystem.enemies && Array.isArray(this.enemySystem.enemies)) {
            this.enemySystem.enemies.forEach(enemy => {
                if (enemy.nameTag) {
                    enemy.nameTag.setPosition(enemy.x, enemy.y - 20);
                }
            });
        }

        // Actualizamos efectos de partículas si el jugador está en agua
        if (this.player.isInWater) {
            this.events.emit('playerInWater', 
                this.player.sprite.x, 
                this.player.sprite.y
            );
        } else {
            this.events.emit('playerOutWater');
        }

        // Actualizar efecto de agua
        if (this.waterEffect) {
            this.waterEffect.update(this, delta);
        }

        // Actualizar barras de salud y maná
        this.statusMenu.updateBar(this.statusMenu.healthBar, this.playerStats.health);
        this.statusMenu.updateBar(this.statusMenu.manaBar, this.playerStats.mana);

        // Eliminar la lógica que actualiza la posición del menú
        // if (this.statusMenu && this.statusMenu.container) {
        //     const camera = this.cameras.main;
        //     this.statusMenu.container.setPosition(
        //         camera.scrollX + 10,
        //         camera.scrollY + 10
        //     );
        // }
        // Update the bars
        this.updateTopRightBars();

        // Update combat system
        if (this.combatSystem && this.enemySystem.enemies.length > 0) {
            // Find closest enemy
            const playerPos = this.player.sprite;
            const closestEnemy = this.enemySystem.enemies.reduce((closest, current) => {
                const currentDist = Phaser.Math.Distance.Between(
                    playerPos.x, playerPos.y,
                    current.x, current.y
                );
                const closestDist = closest ? Phaser.Math.Distance.Between(
                    playerPos.x, playerPos.y,
                    closest.x, closest.y
                ) : Infinity;
                return currentDist < closestDist ? current : closest;
            });

            // Update player direction based on closest enemy
            if (closestEnemy) {
                this.player.sprite.flipX = closestEnemy.x < this.player.sprite.x;
            }
        }
    }

    setupKeyboardEvents() {
        // Status menu toggle with 'E' key
        this.statusKey.on('down', () => {
            this.statusMenu.toggle();
            // Remove or comment out the line below to eliminate the audio effect
            // this.sound.play('menuToggle', { volume: 0.5 });
        });

        // Evento para interacción con agua
        this.events.on('playerInWater', (x, y) => {
            if (this.waterEffect) {
                this.waterEffect.start(x, y);
            }
        });

        this.events.on('playerOutWater', () => {
            if (this.waterEffect) {
                this.waterEffect.stop();
            }
        });
    }

    setupCamera() {
        this.cameras.main.setBackgroundColor('#2d572c');
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.setBounds(0, 0, 
            this.worldSize.width * this.worldSize.tileSize, 
            this.worldSize.height * this.worldSize.tileSize
        );
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.statusKey = this.input.keyboard.addKey('E');

        // Create status menu button
        const buttonBg = this.add.rectangle(780, 550, 80, 30, 0x2d2d2d, 0.9)
            .setScrollFactor(0)
            .setStrokeStyle(2, 0x4a4a4a)
            .setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(780, 550, 'Stats (E)', {
            font: '14px Arial',
            fill: '#ffffff'
        })
        .setScrollFactor(0)
        .setOrigin(0.5);

        // Button events
        buttonBg.on('pointerdown', () => {
            this.statusMenu.toggle();
            this.sound.play('menuToggle', { volume: 0.5 });
        });

        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x3d3d3d);
            buttonText.setStyle({ fill: '#ffd700' });
        });

        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x2d2d2d);
            buttonText.setStyle({ fill: '#ffffff' });
        });
    }

    createTopRightBars() {
        const barWidth = 200;
        const barHeight = 20;
        const gameWidth = this.game.config.width;
        const offsetX = gameWidth - 70;  // Moved more to the left
        const offsetY = 52;   // Moved down
    
        // Health bar
        this.healthBarBg = this.add.rectangle(offsetX, offsetY, barWidth, barHeight, 0x4f0000)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(1000);
        this.healthBar = this.add.rectangle(offsetX, offsetY, barWidth, barHeight, 0xff6b6b)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(1000);
    
        // Mana bar
        this.manaBarBg = this.add.rectangle(offsetX, offsetY + 30, barWidth, barHeight, 0x00264f)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(1000);
        this.manaBar = this.add.rectangle(offsetX, offsetY + 30, barWidth, barHeight, 0x4dabf7)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(1000);
    
        // Text labels - adjusted to match new positions
        this.healthText = this.add.text(offsetX - barWidth + 5, offsetY + 4, 'HP', {
            font: '12px Arial',
            fill: '#ffffff'
        })
        .setScrollFactor(0)
        .setDepth(1000);
    
        this.manaText = this.add.text(offsetX - barWidth + 5, offsetY + 34, 'MP', {
            font: '12px Arial',
            fill: '#ffffff'
        })
        .setScrollFactor(0)
        .setDepth(1000);
    }

    updateTopRightBars() {
        // Update health and mana bars
        if (this.healthBar && this.manaBar) {
            const healthRatio = this.playerStats.health / this.playerStats.maxHealth;
            const manaRatio = this.playerStats.mana / this.playerStats.maxMana;
        
            this.healthBar.displayWidth = healthRatio * this.healthBarBg.width;
            this.manaBar.displayWidth = manaRatio * this.manaBarBg.width;
        
            // Update text to show current/max values
            this.healthText.setText(`HP: ${Math.floor(this.playerStats.health)}/${this.playerStats.maxHealth}`);
            this.manaText.setText(`MP: ${Math.floor(this.playerStats.mana)}/${this.playerStats.maxMana}`);
        }
    }

    update(time, delta) {
        this.player.update(this.cursors, this.wasd, this.statusMenu.visible);
        this.enemySystem.update();
        
        // Verificar que enemies existe antes de actualizar etiquetas
        if (this.enemySystem.enemies && Array.isArray(this.enemySystem.enemies)) {
            this.enemySystem.enemies.forEach(enemy => {
                if (enemy.nameTag) {
                    enemy.nameTag.setPosition(enemy.x, enemy.y - 20);
                }
            });
        }

        // Actualizamos efectos de partículas si el jugador está en agua
        if (this.player.isInWater) {
            this.events.emit('playerInWater', 
                this.player.sprite.x, 
                this.player.sprite.y
            );
        } else {
            this.events.emit('playerOutWater');
        }

        // Actualizar efecto de agua
        if (this.waterEffect) {
            this.waterEffect.update(this, delta);
        }

        // Actualizar barras de salud y maná
        this.statusMenu.updateBar(this.statusMenu.healthBar, this.playerStats.health);
        this.statusMenu.updateBar(this.statusMenu.manaBar, this.playerStats.mana);

        // Eliminar la lógica que actualiza la posición del menú
        // if (this.statusMenu && this.statusMenu.container) {
        //     const camera = this.cameras.main;
        //     this.statusMenu.container.setPosition(
        //         camera.scrollX + 10,
        //         camera.scrollY + 10
        //     );
        // }
        // Update the bars
        this.updateTopRightBars();

        // Update combat system
        if (this.combatSystem && this.enemySystem.enemies.length > 0) {
            // Find closest enemy
            const playerPos = this.player.sprite;
            const closestEnemy = this.enemySystem.enemies.reduce((closest, current) => {
                const currentDist = Phaser.Math.Distance.Between(
                    playerPos.x, playerPos.y,
                    current.x, current.y
                );
                const closestDist = closest ? Phaser.Math.Distance.Between(
                    playerPos.x, playerPos.y,
                    closest.x, closest.y
                ) : Infinity;
                return currentDist < closestDist ? current : closest;
            });

            // Update player direction based on closest enemy
            if (closestEnemy) {
                this.player.sprite.flipX = closestEnemy.x < this.player.sprite.x;
            }
        }

        // Update player with mobile controls if available
        if (this.mobileControls) {
            const mobileInput = this.mobileControls.getControls();
            this.player.updateWithMobileControls(mobileInput);
        }

        // Update the status menu with current stats
        this.statusMenu.updateBaseStats();
    }
}
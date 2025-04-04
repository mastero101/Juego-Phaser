class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log('BootScene: Loading...');
        
        // Create sword texture
        const graphics = this.add.graphics();
        
        // Sword blade
        graphics.lineStyle(4, 0xCCCCCC);
        graphics.beginPath();
        graphics.moveTo(0, 32);
        graphics.lineTo(0, 8);
        graphics.strokePath();
        
        // Sword handle
        graphics.lineStyle(6, 0x8B4513);
        graphics.beginPath();
        graphics.moveTo(-4, 32);
        graphics.lineTo(4, 32);
        graphics.strokePath();
        
        // Sword guard
        graphics.lineStyle(3, 0xFFD700);
        graphics.beginPath();
        graphics.moveTo(-8, 28);
        graphics.lineTo(8, 28);
        graphics.strokePath();

        graphics.generateTexture('sword', 16, 40);
        graphics.destroy();

        // Create slash effect texture
        const slashGraphics = this.add.graphics();
        slashGraphics.lineStyle(4, 0xFFFFFF, 0.8);
        slashGraphics.beginPath();
        slashGraphics.arc(32, 32, 32, 0, Math.PI, true);
        slashGraphics.strokePath();
        slashGraphics.generateTexture('slash', 64, 64);
        slashGraphics.destroy();
    }

    create() {
        console.log('BootScene: Starting game...');
        this.scene.start('GameScene');
    }
}
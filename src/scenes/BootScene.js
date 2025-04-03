class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Here we'll load assets later
    }

    create() {
        this.scene.start('GameScene');
    }
}
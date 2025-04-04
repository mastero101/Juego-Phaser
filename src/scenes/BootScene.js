class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log('BootScene: Loading...');
    }

    create() {
        console.log('BootScene: Starting game...');
        this.scene.start('GameScene');
    }
}
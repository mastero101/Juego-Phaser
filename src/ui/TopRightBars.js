class TopRightBars {
    constructor(scene) {
        this.scene = scene;
        this.barWidth = 200;
        this.barHeight = 20;
        this.offsetX = 780; // Fixed X position
        this.offsetY = 20; // Fixed Y position

        this.createBars();
    }

    createBars() {
        // Health bar
        this.healthBarBg = this.scene.add.rectangle(this.offsetX, this.offsetY, this.barWidth, this.barHeight, 0x4f0000)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1000);
        this.healthBar = this.scene.add.rectangle(this.offsetX, this.offsetY, this.barWidth, this.barHeight, 0xff6b6b)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1000);

        // Mana bar
        this.manaBarBg = this.scene.add.rectangle(this.offsetX, this.offsetY + 30, this.barWidth, this.barHeight, 0x00264f)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1000);
        this.manaBar = this.scene.add.rectangle(this.offsetX, this.offsetY + 30, this.barWidth, this.barHeight, 0x4dabf7)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1000);
    }

    updateBars(health, maxHealth, mana, maxMana) {
        const healthRatio = health / maxHealth;
        const manaRatio = mana / maxMana;

        this.healthBar.displayWidth = healthRatio * this.barWidth;
        this.manaBar.displayWidth = manaRatio * this.barWidth;
    }
}

module.exports = TopRightBars;
class StatusMenu {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.visible = false;
    }

    create() {
        this.container = this.scene.add.container(90, 50);
        this.container.setScrollFactor(0);
        this.container.setDepth(1000);
        
        // Fondo principal mejorado con gradiente
        this.menuBg = this.scene.add.rectangle(150, 100, 320, 790, 0x1e1e1e, 0.85); // Color más suave
        this.menuBg.setStrokeStyle(2, 0x5a5a5a);
        this.container.add(this.menuBg);
        
        // Encabezado mejorado
        const headerBg = this.scene.add.rectangle(150, 30, 320, 40, 0x2b2b2b, 0.9);
        headerBg.setStrokeStyle(2, 0x7a7a7a);
        this.container.add(headerBg);

        // Título del menú
        const titleStyle = {
            font: 'bold 20px Arial', // Tamaño de fuente más grande
            fill: '#ffd700',
            padding: { x: 10, y: 5 }
        };
        const title = this.scene.add.text(40, 20, 'CHARACTER STATS', titleStyle);
        this.container.add(title);

        this.createBaseStats();
        this.createProgressBars();
        this.createCollapsibleSection('WEAPON SKILLS', this.scene.playerStats.weaponSkills, 290);
        this.createCollapsibleSection('MAGIC SKILLS', this.scene.playerStats.magicSkills, 390);
        
        this.container.setVisible(false);
    }

    createText(scene, text, x, y, style = {}) {
        return scene.add.text(x, y, text, {
            font: '16px Arial', // Tamaño de fuente más grande
            fill: '#ffffff',
            ...style
        });
    }

    createBaseStats() {
        const style = {
            font: 'bold 16px Arial',
            fill: '#ffffff',
            padding: { x: 10, y: 5 }
        };
        
        const stats = [
            { label: 'Level:', value: this.scene.playerStats.level.toString(), color: '#ffd700' },
            { label: 'Experience:', value: `${this.scene.playerStats.experience}/${this.scene.playerStats.nextLevel}`, color: '#00ff00' },
            { label: 'Strength:', value: this.scene.playerStats.strength.toString(), color: '#ff9966' },
            { label: 'Defense:', value: this.scene.playerStats.defense.toString(), color: '#66ccff' }
        ];

        let currentY = 55;
        stats.forEach(stat => {
            const statBg = this.scene.add.rectangle(150, currentY + 10, 280, 30, 0x2b2b2b, 0.5);
            const label = this.createText(this.scene, stat.label, 40, currentY, style);
            const valueStyle = {...style, fill: stat.color};
            const value = this.createText(this.scene, stat.value, 170, currentY, valueStyle);
            this.container.add([statBg, label, value]);
            currentY += 35;
        });
    }

    createProgressBars() {
        // Crear barra de salud
        this.healthBar = this.createBar(210, 'Health',  // Ajustado de 180 a 200
            this.scene.playerStats.health,
            this.scene.playerStats.maxHealth,
            '#ff6b6b', '#4f0000');

        // Crear barra de maná
        this.manaBar = this.createBar(250, 'Mana',     // Ajustado de 220 a 240
            this.scene.playerStats.mana,
            this.scene.playerStats.maxMana,
            '#4dabf7', '#00264f');
    }

    createBar(y, label, value, maxValue, fillColor, bgColor) {
        const width = 260;
        const height = 20;
        const x = 150;
        
        // Fondo de la barra
        const barBg = this.scene.add.rectangle(x, y, width, height, bgColor, 1);
        barBg.setStrokeStyle(1, 0x000000);
        
        // Barra de progreso
        const progress = width * (value / maxValue);
        const bar = this.scene.add.rectangle(x - (width - progress)/2, y, progress, height, fillColor, 1);
        
        // Texto
        const text = this.scene.add.text(x - width/2, y - height/2,
            `${label}: ${value}/${maxValue}`, {
            font: '14px Arial',
            fill: '#ffffff'
        });
        text.setOrigin(0, 0);
        
        this.container.add([barBg, bar, text]);

        return { bar, text, maxValue, width, label };
    }

    updateBar(barData, newValue) {
        const { bar, text, maxValue, width, label } = barData;
        const newWidth = (newValue / maxValue) * width;

        this.scene.tweens.add({
            targets: bar,
            displayWidth: newWidth,
            duration: 200,
            ease: 'Linear'
        });

        text.setText(`${label}: ${newValue}/${maxValue}`);
    }

    createCollapsibleSection(title, items, startY) {
        const style = { font: '14px Arial', fill: '#ffffff' };
        const headerBg = this.scene.add.rectangle(120, startY, 200, 25, 0x3d3d3d, 0.9)
            .setScrollFactor(0)  // Añadido para fijar posición
            .setStrokeStyle(1, 0x6d6d6d);
        headerBg.setInteractive({ useHandCursor: true });
        
        const headerText = this.scene.add.text(40, startY - 8, title, {
            ...style,
            font: 'bold 14px Arial'
        })
        .setScrollFactor(0);  // Añadido para fijar posición
        
        const toggleButton = this.scene.add.text(195, startY - 8, '+', {
            font: 'bold 16px Arial',
            fill: '#ffffff'
        })
        .setScrollFactor(0);  // Añadido para fijar posición
    
        const content = this.scene.add.container(0, startY + 25)
            .setScrollFactor(0);  // Añadido para fijar posición
        
        Object.entries(items).forEach(([key, value], index) => {
            const y = index * 25;
            const itemBg = this.scene.add.rectangle(120, y, 180, 22, 0x232323, 0.7)
                .setScrollFactor(0);  // Añadido para fijar posición
            const label = this.scene.add.text(40, y - 8, key + ':', style)
                .setScrollFactor(0);  // Añadido para fijar posición
            const valueText = this.scene.add.text(140, y - 8, value.toString(), {
                ...style,
                fill: '#ffd700'
            })
            .setScrollFactor(0);  // Añadido para fijar posición
            
            content.add([itemBg, label, valueText]);
        });
    
        this.container.add([headerBg, headerText, toggleButton, content]);
        content.setVisible(false);
    
        headerBg.on('pointerdown', () => {
            content.setVisible(!content.visible);
            toggleButton.setText(content.visible ? '-' : '+');
            this.adjustMenuSize();
        });
    }

    adjustMenuSize() {
        const expandedHeight = 680; // Adjust this value based on the expanded content
        const collapsedHeight = 300; // Adjust this value based on the collapsed content
        const isExpanded = this.container.list.some(item => item.visible && item instanceof Phaser.GameObjects.Container);

        this.scene.tweens.add({
            targets: this.menuBg,
            height: isExpanded ? expandedHeight : collapsedHeight,
            alpha: isExpanded ? 0.92 : 0.7, // Adjust transparency
            duration: 300,
            ease: 'Cubic.easeInOut'
        });
    }

    toggle() {
        this.visible = !this.visible;
        if (this.container) {
            if (this.visible) {
                this.container.setVisible(true);
                this.scene.tweens.add({
                    targets: this.container,
                    alpha: 1,
                    duration: 300,
                    ease: 'Cubic.easeOut'
                });
            } else {
                this.scene.tweens.add({
                    targets: this.container,
                    alpha: 0,
                    duration: 300,
                    ease: 'Cubic.easeIn',
                    onComplete: () => this.container.setVisible(false)
                });
            }
        }
    }
}
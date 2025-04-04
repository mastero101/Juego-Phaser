class MobileControls {
    constructor(scene) {
        this.scene = scene;
        this.controls = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.joystick = {
            isActive: false,
            pointer: null,
            baseX: 0,
            baseY: 0,
            thumbX: 0,
            thumbY: 0
        };

        if (scene.sys.game.device.input.touch) {
            this.createControls();
        }
    }

    createControls() {
        const padding = 50;
        const buttonSize = 80;
        const joystickRadius = 100;
        const buttonAlpha = 0.8;

        this.container = this.scene.add.container(0, 0)
            .setScrollFactor(0)
            .setDepth(1000);

        // Adjusted joystick base position more to the right
        const baseX = padding + joystickRadius + 35;
        const baseY = this.scene.game.config.height - padding - joystickRadius;

        this.joystickBase = this.scene.add.circle(baseX, baseY, joystickRadius, 0x333333, 0.3);
        this.joystickThumb = this.scene.add.circle(baseX, baseY, 40, 0x666666, 0.8);

        // Make joystick interactive
        this.joystickBase.setInteractive()
            .on('pointerdown', (pointer) => this.startJoystick(pointer))
            .on('pointerup', () => this.stopJoystick())
            .on('pointerout', () => this.stopJoystick());

        this.scene.input.on('pointermove', (pointer) => {
            if (this.joystick.isActive && this.joystick.pointer === pointer) {
                this.updateJoystick(pointer);
            }
        });

        // Attack button
        const attackButton = this.scene.add.circle(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding - buttonSize,
            buttonSize/2,
            0xff0000
        )
        .setAlpha(buttonAlpha)
        .setInteractive();

        const attackText = this.scene.add.text(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding - buttonSize,
            '⚔️',
            { font: '40px Arial' }
        ).setOrigin(0.5);

        // Add menu button (positioned above attack button)
        const menuButton = this.scene.add.circle(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding * 3 - buttonSize,
            buttonSize/2,
            0x4a4a4a
        )
        .setAlpha(buttonAlpha)
        .setInteractive();

        const menuText = this.scene.add.text(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding * 3 - buttonSize,
            '📋',
            { font: '40px Arial' }
        ).setOrigin(0.5);

        menuButton.on('pointerdown', () => {
            this.scene.statusMenu.toggle();
        });

        this.container.add([
            this.joystickBase, 
            this.joystickThumb, 
            attackButton, 
            attackText,
            menuButton,
            menuText
        ]);
    }

    startJoystick(pointer) {
        this.joystick.isActive = true;
        this.joystick.pointer = pointer;
        this.joystick.baseX = this.joystickBase.x;
        this.joystick.baseY = this.joystickBase.y;
    }

    updateJoystick(pointer) {
        const distance = Phaser.Math.Distance.Between(
            this.joystick.baseX, this.joystick.baseY,
            pointer.x, pointer.y
        );
        const angle = Phaser.Math.Angle.Between(
            this.joystick.baseX, this.joystick.baseY,
            pointer.x, pointer.y
        );

        const radius = this.joystickBase.width / 2;
        const limitedDistance = Math.min(distance, radius);

        this.joystickThumb.x = this.joystick.baseX + Math.cos(angle) * limitedDistance;
        this.joystickThumb.y = this.joystick.baseY + Math.sin(angle) * limitedDistance;

        // Update controls based on joystick position
        const deadzone = 0.3;
        const normalizedX = Math.cos(angle) * (limitedDistance / radius);
        const normalizedY = Math.sin(angle) * (limitedDistance / radius);

        this.controls.left = normalizedX < -deadzone;
        this.controls.right = normalizedX > deadzone;
        this.controls.up = normalizedY < -deadzone;
        this.controls.down = normalizedY > deadzone;
    }

    stopJoystick() {
        this.joystick.isActive = false;
        this.joystick.pointer = null;
        this.joystickThumb.x = this.joystick.baseX;
        this.joystickThumb.y = this.joystick.baseY;
        
        // Reset all controls
        Object.keys(this.controls).forEach(key => this.controls[key] = false);
    }

    getControls() {
        return this.controls;
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
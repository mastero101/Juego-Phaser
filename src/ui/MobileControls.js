class MobileControls {
    constructor(scene) {
        this.scene = scene;
        this.controls = {
            up: false,
            down: false,
            left: false,
            right: false,
            attack: false,    // Añadido control de ataque
            menu: false      // Añadido control de menú
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

        // Configurar los elementos para que sean fijos
        const makeFixed = (gameObject) => {
            gameObject.setScrollFactor(0);
            return gameObject;
        };

        // Joystick
        const baseX = padding + joystickRadius + 50;
        const baseY = this.scene.game.config.height - padding - joystickRadius - 30;

        this.joystickBase = makeFixed(this.scene.add.circle(baseX, baseY, joystickRadius, 0x333333, 0.3));
        this.joystickThumb = makeFixed(this.scene.add.circle(baseX, baseY, 40, 0x666666, 0.8));

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

        this.scene.input.on('pointerup', (pointer) => {
            if (this.joystick.pointer === pointer) {
                this.stopJoystick();
            }
        });

        // Attack button
        const attackButton = makeFixed(this.scene.add.circle(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding - buttonSize,
            buttonSize/2,
            0xff0000
        ).setAlpha(buttonAlpha));

        const attackText = makeFixed(this.scene.add.text(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding - buttonSize,
            '⚔️',
            { font: '40px Arial' }
        ).setOrigin(0.5));

        // Menu button
        const menuButton = makeFixed(this.scene.add.circle(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding * 3 - buttonSize,
            buttonSize/2,
            0x4a4a4a
        ).setAlpha(buttonAlpha));

        const menuText = makeFixed(this.scene.add.text(
            this.scene.game.config.width - padding - buttonSize,
            this.scene.game.config.height - padding * 3 - buttonSize,
            '📋',
            { font: '40px Arial' }
        ).setOrigin(0.5));

        // Hacer los botones interactivos
        attackButton.setInteractive();
        menuButton.setInteractive();

        // Eventos de los botones
        attackButton
            .on('pointerdown', () => {
                this.controls.attack = true;
                if (this.scene.combatSystem) {
                    this.scene.combatSystem.performAttack();
                }
            })
            .on('pointerup', () => {
                this.controls.attack = false;
            })
            .on('pointerout', () => {
                this.controls.attack = false;
            });

        menuButton.on('pointerdown', () => {
            if (this.scene.statusMenu) {
                this.scene.statusMenu.toggle();
            }
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

    destroy() {
        if (this.container) {
            // Asegurarse de eliminar la cámara UI cuando se destruyen los controles
            const uiCamera = this.scene.cameras.getCamerasBelowTop()[0];
            if (uiCamera) {
                this.scene.cameras.remove(uiCamera);
            }
            this.container.destroy();
        }
    }

    updateJoystick(pointer) {
        if (!this.joystick.isActive) return;

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

        const deadzone = 0.3;
        const normalizedX = Math.cos(angle) * (limitedDistance / radius);
        const normalizedY = Math.sin(angle) * (limitedDistance / radius);

        // Actualizar solo los controles direccionales
        this.controls.left = normalizedX < -deadzone;
        this.controls.right = normalizedX > deadzone;
        this.controls.up = normalizedY < -deadzone;
        this.controls.down = normalizedY > deadzone;
    }

    startJoystick(pointer) {
        this.joystick.isActive = true;
        this.joystick.pointer = pointer;
        this.joystick.baseX = this.joystickBase.x;
        this.joystick.baseY = this.joystickBase.y;
    }

    updateJoystick(pointer) {
        // Mantener el estado actual de attack y menu
        const currentAttack = this.controls.attack;
        const currentMenu = this.controls.menu;
        
        // Actualizar controles direccionales
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

        const deadzone = 0.3;
        const normalizedX = Math.cos(angle) * (limitedDistance / radius);
        const normalizedY = Math.sin(angle) * (limitedDistance / radius);

        // Actualizar solo los controles direccionales
        this.controls.left = normalizedX < -deadzone;
        this.controls.right = normalizedX > deadzone;
        this.controls.up = normalizedY < -deadzone;
        this.controls.down = normalizedY > deadzone;

        // Restaurar el estado de attack y menu
        this.controls.attack = currentAttack;
        this.controls.menu = currentMenu;
    }

    stopJoystick() {
        this.joystick.isActive = false;
        this.joystick.pointer = null;
        this.joystickThumb.x = this.joystick.baseX;
        this.joystickThumb.y = this.joystick.baseY;
        
        // Reset all directional controls
        this.controls.up = false;
        this.controls.down = false;
        this.controls.left = false;
        this.controls.right = false;
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
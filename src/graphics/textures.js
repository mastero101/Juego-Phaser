function createTileTextures(scene) {
    const graphics = scene.add.graphics();
    
    // Create grass texture
    graphics.fillStyle(0x3a5a40);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('grass', 32, 32);
    graphics.clear();

    // Create water texture
    graphics.fillStyle(0x219ebc);
    graphics.fillRect(0, 0, 32, 32);
    graphics.lineStyle(1, 0x90e0ef);
    graphics.strokeRect(0, 0, 32, 32);
    graphics.generateTexture('water', 32, 32);
    graphics.clear();

    // Create path texture
    graphics.fillStyle(0xd4a373);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('path', 32, 32);
    graphics.clear();

    // Create tree texture
    graphics.fillStyle(0x2d6a4f);
    graphics.fillRect(8, 0, 16, 24);
    graphics.fillStyle(0x40916c);
    graphics.fillRect(8, 24, 16, 8);
    graphics.generateTexture('tree', 32, 32);
    graphics.clear();
}

function createCharacterTexture(scene, textureName, isStepFrame) {
    const graphics = scene.add.graphics();
    
    // Cabeza
    graphics.fillStyle(0x2C1810);  // Color cabello oscuro
    graphics.fillRect(12, 4, 8, 5);  // Pelo base
    graphics.fillRect(11, 6, 10, 2);  // Pelo lateral
    
    graphics.fillStyle(0xFFC8A8);  // Color piel más cálido
    graphics.fillRect(12, 9, 8, 4);  // Cara
    
    graphics.fillStyle(0x000000);  // Ojos negros
    graphics.fillRect(13, 10, 2, 2);  // Ojo izquierdo
    graphics.fillRect(17, 10, 2, 2);  // Ojo derecho
    
    // Torso
    graphics.fillStyle(0x964B00);  // Marrón túnica
    graphics.fillRect(11, 13, 10, 11);  // Cuerpo principal
    graphics.fillStyle(0x6B3400);  // Sombras túnica
    graphics.fillRect(11, 13, 2, 11);  // Sombra lateral
    graphics.fillRect(11, 20, 10, 2);  // Cinturón
    
    // Brazos
    graphics.fillStyle(0x964B00);  // Color túnica
    if (isStepFrame) {
        graphics.fillRect(9, 13, 2, 7);   // Brazo izquierdo
        graphics.fillRect(21, 13, 2, 7);  // Brazo derecho
        graphics.fillStyle(0xFFC8A8);     // Manos
        graphics.fillRect(9, 20, 2, 2);   // Mano izquierda
        graphics.fillRect(21, 20, 2, 2);  // Mano derecha
    } else {
        graphics.fillRect(9, 14, 2, 7);   // Brazo izquierdo
        graphics.fillRect(21, 14, 2, 7);  // Brazo derecho
        graphics.fillStyle(0xFFC8A8);     // Manos
        graphics.fillRect(9, 21, 2, 2);   // Mano izquierda
        graphics.fillRect(21, 21, 2, 2);  // Mano derecha
    }
    
    // Piernas
    graphics.fillStyle(0x6B3400);  // Pantalón más oscuro
    if (isStepFrame) {
        graphics.fillRect(12, 24, 4, 8);  // Pierna izquierda
        graphics.fillRect(16, 24, 4, 6);  // Pierna derecha
        graphics.fillStyle(0x4A2500);     // Botas
        graphics.fillRect(12, 30, 4, 2);  // Bota izquierda
        graphics.fillRect(16, 28, 4, 2);  // Bota derecha
    } else {
        graphics.fillRect(12, 24, 4, 6);  // Pierna izquierda
        graphics.fillRect(16, 24, 4, 6);  // Pierna derecha
        graphics.fillStyle(0x4A2500);     // Botas
        graphics.fillRect(12, 28, 4, 2);  // Bota izquierda
        graphics.fillRect(16, 28, 4, 2);  // Bota derecha
    }
    
    graphics.generateTexture(textureName, 32, 32);
    graphics.clear();
}

function createEnemyTextures(scene, enemyTypes) {
    const graphics = scene.add.graphics();
    
    Object.entries(enemyTypes).forEach(([type, data]) => {
        switch(type) {
            case 'slime':
                // Cuerpo principal
                graphics.fillStyle(0x00AA00);
                graphics.fillRect(10, 16, 12, 6);  // Base ancha
                graphics.fillRect(11, 15, 10, 7);  // Cuerpo medio
                graphics.fillRect(12, 14, 8, 8);   // Cuerpo central
                // Detalles y sombras
                graphics.fillStyle(0x008800);
                graphics.fillRect(10, 20, 12, 2);  // Sombra inferior
                graphics.fillRect(11, 15, 2, 5);   // Sombra lateral
                // Brillos
                graphics.fillStyle(0x00FF00);
                graphics.fillRect(14, 15, 2, 1);   // Brillo superior
                graphics.fillRect(13, 16, 2, 1);   // Brillo medio
                // Ojos
                graphics.fillStyle(0x000000);
                graphics.fillRect(13, 16, 2, 2);   // Ojo izquierdo
                graphics.fillRect(17, 16, 2, 2);   // Ojo derecho
                break;
                
            case 'skeleton':
                // Cráneo detallado
                graphics.fillStyle(0xFFFFFF);
                graphics.fillRect(12, 8, 8, 7);    // Cabeza base
                graphics.fillStyle(0xDDDDDD);
                graphics.fillRect(12, 13, 8, 2);   // Mandíbula
                graphics.fillRect(13, 8, 6, 1);    // Sombra superior
                // Ojos y detalles
                graphics.fillStyle(0x000000);
                graphics.fillRect(14, 10, 2, 3);   // Ojo izquierdo
                graphics.fillRect(17, 10, 2, 3);   // Ojo derecho
                graphics.fillRect(13, 14, 2, 1);   // Dientes izquierda
                graphics.fillRect(17, 14, 2, 1);   // Dientes derecha
                // Cuerpo esquelético
                graphics.fillStyle(0xFFFFFF);
                graphics.fillRect(13, 15, 6, 9);   // Torso
                graphics.fillRect(11, 16, 2, 7);   // Brazo izquierdo
                graphics.fillRect(19, 16, 2, 7);   // Brazo derecho
                graphics.fillRect(14, 24, 2, 6);   // Pierna izquierda
                graphics.fillRect(16, 24, 2, 6);   // Pierna derecha
                // Detalles huesos
                graphics.fillStyle(0xDDDDDD);
                graphics.fillRect(13, 17, 6, 1);   // Costillas
                graphics.fillRect(13, 19, 6, 1);   // Costillas
                graphics.fillRect(13, 21, 6, 1);   // Costillas
                break;
                
            case 'goblin':
                // Cabeza detallada
                graphics.fillStyle(0x355E3B);
                graphics.fillRect(12, 8, 8, 6);    // Cabeza base
                graphics.fillRect(11, 10, 1, 3);   // Oreja izquierda
                graphics.fillRect(20, 10, 1, 3);   // Oreja derecha
                // Rostro
                graphics.fillStyle(0x2B4B31);
                graphics.fillRect(12, 12, 8, 2);   // Mandíbula
                graphics.fillStyle(0x000000);
                graphics.fillRect(13, 10, 2, 2);   // Ojo izquierdo
                graphics.fillRect(17, 10, 2, 2);   // Ojo derecho
                // Cuerpo y armadura
                graphics.fillStyle(0x355E3B);
                graphics.fillRect(13, 14, 6, 8);   // Torso
                graphics.fillStyle(0x2B4B31);
                graphics.fillRect(13, 14, 6, 2);   // Hombreras
                graphics.fillRect(13, 18, 6, 2);   // Cinturón
                // Brazos y piernas
                graphics.fillStyle(0x355E3B);
                graphics.fillRect(11, 15, 2, 6);   // Brazo izquierdo
                graphics.fillRect(19, 15, 2, 6);   // Brazo derecho
                graphics.fillStyle(0x2B4B31);
                graphics.fillRect(14, 22, 2, 5);   // Pierna izquierda
                graphics.fillRect(16, 22, 2, 5);   // Pierna derecha
                break;
            case 'minotaur':
                // Cuerpo principal
                graphics.fillStyle(0x8B4513);      // Marrón base
                graphics.fillRect(12, 14, 8, 10);  // Torso
                
                // Cabeza
                graphics.fillRect(13, 8, 6, 6);    // Cabeza base
                
                // Cuernos prominentes
                graphics.fillRect(11, 6, 2, 4);    // Cuerno izquierdo
                graphics.fillRect(19, 6, 2, 4);    // Cuerno derecho
                
                // Brazos musculosos
                graphics.fillRect(10, 14, 2, 8);   // Brazo izquierdo
                graphics.fillRect(20, 14, 2, 8);   // Brazo derecho
                
                // Piernas robustas
                graphics.fillRect(13, 24, 3, 4);   // Pierna izquierda
                graphics.fillRect(16, 24, 3, 4);   // Pierna derecha
                break;
            case 'spider':
                // Cuerpo
                graphics.fillStyle(0x000000);
                graphics.fillRect(12, 12, 8, 8);   // Cuerpo central
                // Patas
                graphics.fillRect(10, 10, 2, 12);  // Pata frontal izq
                graphics.fillRect(20, 10, 2, 12);  // Pata frontal der
                graphics.fillRect(8, 14, 2, 8);    // Pata media izq
                graphics.fillRect(22, 14, 2, 8);   // Pata media der
                graphics.fillRect(10, 18, 2, 8);   // Pata trasera izq
                graphics.fillRect(20, 18, 2, 8);   // Pata trasera der
                // Ojos
                graphics.fillStyle(0xFF0000);
                graphics.fillRect(13, 14, 2, 2);   // Ojos izquierdos
                graphics.fillRect(17, 14, 2, 2);   // Ojos derechos
                break;
            case 'elf':
                // Cabeza y orejas élficas
                graphics.fillStyle(0xFFE4B5);      // Piel élfica
                graphics.fillRect(12, 8, 8, 6);    // Cabeza
                graphics.fillRect(10, 9, 2, 3);    // Oreja izquierda
                graphics.fillRect(20, 9, 2, 3);    // Oreja derecha
                // Cabello largo
                graphics.fillStyle(0xFFD700);      // Dorado
                graphics.fillRect(11, 6, 10, 3);   // Pelo superior
                graphics.fillRect(11, 8, 2, 4);    // Mechón izquierdo
                graphics.fillRect(19, 8, 2, 4);    // Mechón derecho
                // Armadura élfica
                graphics.fillStyle(0x98FB98);      // Verde claro
                graphics.fillRect(12, 14, 8, 10);  // Torso
                break;
            case 'demon':
                // Cabeza y cuernos demoníacos
                graphics.fillStyle(0x8B0000);      // Rojo oscuro
                graphics.fillRect(12, 8, 8, 6);    // Cabeza
                graphics.fillRect(10, 6, 2, 3);    // Cuerno izquierdo
                graphics.fillRect(20, 6, 2, 3);    // Cuerno derecho
                // Ojos brillantes
                graphics.fillStyle(0xFF4500);      // Naranja fuego
                graphics.fillRect(13, 10, 2, 2);   // Ojo izquierdo
                graphics.fillRect(17, 10, 2, 2);   // Ojo derecho
                // Cuerpo demoníaco
                graphics.fillStyle(0x8B0000);
                graphics.fillRect(11, 14, 10, 12); // Torso
                graphics.fillStyle(0x000000);      // Sombras
                graphics.fillRect(11, 14, 2, 12);  // Sombra lateral
                break;
        }
        
        graphics.generateTexture(type, 32, 32);
        graphics.clear();
    });
}

function createEnemyNameTag(scene, x, y, enemyType) {
    // Traducir nombres a español
    const nameTranslations = {
        'slime': 'SLIME',
        'skeleton': 'ESQUELETO',
        'goblin': 'GOBLIN',
        'minotaur': 'MINOTAURO',
        'spider': 'ARAÑA',
        'elf': 'ELFO',
        'demon': 'DEMONIO'
    };

    const displayName = nameTranslations[enemyType] || enemyType.toUpperCase();
    
    const text = scene.add.text(x, y - 15, displayName, {
        fontSize: '8px',
        fontFamily: 'Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 3, y: 1 },
        align: 'center'
    });
    
    text.setOrigin(0.5, 1);
    text.setDepth(1);  // Asegura que el texto esté siempre visible
    
    return text;
}
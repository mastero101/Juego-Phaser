const enemyTypes = {
    slime: {
        health: 20,
        damage: 20,
        speed: 40,
        experience: 15,
        color: 0x00FF00
    },
    skeleton: {
        health: 35,
        damage: 15,
        speed: 60,
        experience: 25,
        color: 0xCCCCCC
    },
    goblin: {
        health: 30,
        damage: 12,
        speed: 80,
        experience: 20,
        color: 0x967969
    }
};

const enemySpawnConfig = {
    maxEnemies: 15,
    spawnInterval: 5000,
    minDistanceFromPlayer: 200
};
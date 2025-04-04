const initialPlayerStats = {
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    magicLevel: 1,
    strength: 10,
    defense: 5,
    experience: 0,
    nextLevel: 100,
    weaponSkills: {
        sword: 5,
        bow: 1,
        staff: 3
    },
    magicSkills: {
        fire: 2,
        ice: 1,
        lightning: 1
    }
};

const levelUpRequirements = {
    experienceMultiplier: 1.5,
    statsIncrease: {
        health: 20,
        mana: 10,
        strength: 2,
        defense: 1
    }
};
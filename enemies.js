// ========== ВРАГИ ==========
let enemies = [];

function createZombie(type, x, y, isLabMutant = false) {
    if (isLabMutant) {
        return {
            x, y, hp: 140, maxHp: 140, dmg: 34, speed: 1.4, size: 52,
            name: "🧬 МУТАНТ", color: "#8f4f2a", visionRadius: 380,
            wanderAngle: Math.random() * Math.PI * 2, boss: false, labMutant: true
        };
    }
    if (type === 0) {
        return {
            x, y, hp: 34, maxHp: 34, dmg: 11, speed: 2.3, size: 32,
            name: "Бегун🧟", color: "#7e9a56", visionRadius: 340,
            wanderAngle: Math.random() * Math.PI * 2, boss: false
        };
    } else if (type === 1) {
        return {
            x, y, hp: 58, maxHp: 58, dmg: 17, speed: 1.25, size: 40,
            name: "Зомби🧟", color: "#6e8650", visionRadius: 330,
            wanderAngle: Math.random() * Math.PI * 2, boss: false
        };
    } else {
        return {
            x, y, hp: 110, maxHp: 110, dmg: 27, speed: 0.75, size: 48,
            name: "Тяжёлый🧟", color: "#4e683a", visionRadius: 310,
            wanderAngle: Math.random() * Math.PI * 2, boss: false
        };
    }
}

function spawnBoss(bossId, x, y) {
    enemies.push({
        x, y, hp: 520, maxHp: 520, dmg: 48, speed: 1.25, size: 76,
        name: "👑 ОМЕГА-МУТАНТ", color: "#cf3a1a", boss: true,
        visionRadius: 450, wanderAngle: 0, bossType: "final", labMutant: true
    });
}

function moveEnemies() {
    for (let e of enemies) {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const distToPlayer = Math.hypot(dx, dy);
        let moveX = 0, moveY = 0;

        if (distToPlayer < e.visionRadius) {
            const angle = Math.atan2(dy, dx);
            moveX = Math.cos(angle) * e.speed;
            moveY = Math.sin(angle) * e.speed;
        } else {
            e.wanderAngle += (Math.random() - 0.5) * 0.5;
            moveX = Math.cos(e.wanderAngle) * e.speed * 0.5;
            moveY = Math.sin(e.wanderAngle) * e.speed * 0.3;
        }

        e.x += moveX;
        e.y += moveY;

        // Коллизия с платформами
        for (let p of platforms) {
            if (e.y + e.size / 2 > p[1] && e.y - e.size / 2 < p[1] + p[3] &&
                e.x + e.size / 2 > p[0] && e.x - e.size / 2 < p[0] + p[2]) {
                e.y = p[1] - e.size / 2;
                break;
            }
        }

        if (e.y + e.size / 2 > GROUND_Y + 20) e.y = GROUND_Y - e.size / 2;
        e.x = Math.min(WORLD_W - 50, Math.max(50, e.x));
        e.y = Math.min(H - 70, Math.max(40, e.y));
    }
}

function spawnInitialEnemies() {
    for (let i = 0; i < 5; i++) {
        const type = Math.floor(Math.random() * 3);
        const x = 200 + Math.random() * 2000;
        enemies.push(createZombie(type, x, GROUND_Y - 40));
    }
}
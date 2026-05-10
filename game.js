// ========== ОСНОВНАЯ ЛОГИКА ИГРЫ ==========
let gameActive = false;
let gameVictory = false;
let lastSpawnTime = Date.now();
const SPAWN_INTERVAL = 45000;

function checkEnterLab() {
    if (player.x > 3100 && !window.labEnteredFlag) {
        window.labEnteredFlag = true;
        showThought("Хм... лаборатория. Здесь нет обычных зомби, только сильные мутанты.", 5000);
        setTimeout(() => {
            showThought("Отсюда идет заражение. Надо уничтожить источник вируса...", 4500);
        }, 3000);
    }
}

function spawnLabEnemies() {
    if (!window.labSpawned && player.x > 3200) {
        window.labSpawned = true;
        for (let i = 0; i < 5; i++) {
            const x = 3400 + Math.random() * 1000;
            const y = GROUND_Y - 50;
            enemies.push(createZombie(2, x, y, true));
        }
        spawnBoss(0, 4200, GROUND_Y - 70);
    }
}

function trySpawnTimerZombie() {
    if (player.x > 3100) return; // в лаборатории нет обычных зомби
    const now = Date.now();
    if (now - lastSpawnTime >= SPAWN_INTERVAL && enemies.length < 12) {
        lastSpawnTime = now;
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
            const type = Math.floor(Math.random() * 3);
            const angle = Math.random() * Math.PI * 2;
            const dist = 400 + Math.random() * 400;
            let spawnX = player.x + Math.cos(angle) * dist;
            spawnX = Math.min(WORLD_W - 300, Math.max(100, spawnX));
            enemies.push(createZombie(type, spawnX, GROUND_Y - 40));
        }
    }
}

function update() {
    if (!gameActive || gameVictory) return;
    updatePlayerPhysics();
    moveEnemies();
    updateCombat();
    checkEnterLab();
    spawnLabEnemies();
    trySpawnTimerZombie();
    document.getElementById('hpVal').innerText = Math.floor(Math.max(0, player.hp));
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(-cameraX, 0);

    drawBiomeBackground(ctx);

    // Земля
    ctx.fillStyle = "#5d4a32";
    ctx.fillRect(0, GROUND_Y, WORLD_W, 120);

    // Платформы
    for (let p of platforms) {
        ctx.fillStyle = "#947a52";
        ctx.fillRect(p[0], p[1], p[2], p[3]);
    }

    // Источник вируса
    if (virusSource.active && player.x > 3800) {
        ctx.fillStyle = "#44ff44aa";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(virusSource.x, virusSource.y, virusSource.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffff00";
        ctx.font = "bold 18px monospace";
        ctx.fillText("☣️ ИСТОЧНИК ВИРУСА ☣️", virusSource.x - 90, virusSource.y - 25);
        ctx.fillStyle = "white";
        ctx.font = "12px monospace";
        ctx.fillText("нажми E чтобы уничтожить", virusSource.x - 80, virusSource.y + 15);
    }

    // Лут
    for (let l of lootItems) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(l.x, l.y, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Враги
    for (let e of enemies) {
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.ellipse(e.x, e.y, e.size / 1.6, e.size / 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#221100";
        ctx.font = "bold 11px monospace";
        ctx.fillText(e.name, e.x - 22, e.y - 12);
        ctx.fillStyle = "#aa3333";
        ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2 - 8, (e.hp / e.maxHp) * e.size, 5);
        if (e.boss) {
            ctx.fillStyle = "orange";
            ctx.font = "bold 12px";
            ctx.fillText("⚠️БОСС⚠️", e.x - 25, e.y - 25);
        }
    }

    // Игрок
    if (player.vehicleType === 0) {
        ctx.fillStyle = "#dba551";
        ctx.fillRect(player.x, player.y, 30, 46);
    } else if (player.vehicleType === 1) {
        ctx.fillStyle = "#cc4422";
        ctx.fillRect(player.x, player.y, 48, 28);
        ctx.fillStyle = "black";
        ctx.fillRect(player.x + 6, player.y + 20, 9, 9);
        ctx.fillRect(player.x + 34, player.y + 20, 9, 9);
    } else {
        ctx.fillStyle = "#3388dd";
        ctx.fillRect(player.x, player.y + 14, 44, 18);
        ctx.beginPath();
        ctx.arc(player.x + 38, player.y + 27, 9, 0, 2 * Math.PI);
        ctx.fill();
        ctx.arc(player.x + 8, player.y + 27, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Пули
    for (let b of bullets) {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(draw);
}

function gameLoop() {
    update();
    draw();
    if (gameActive && !gameVictory) requestAnimationFrame(gameLoop);
}
// ========== БОЕВАЯ СИСТЕМА ==========
let bullets = [];
let lastShot = 0;
let lootItems = [];

function shoot(mouseScreenX, mouseScreenY) {
    const now = Date.now();
    const wp = weapons[player.weaponId];
    if (now - lastShot < wp.cooldown) return;
    lastShot = now;

    const fromX = player.x + (player.facingRight ? 28 : -10);
    const fromY = player.y + 22;
    const targetX = mouseScreenX + cameraX;
    const targetY = mouseScreenY;
    const dx = targetX - fromX;
    const dy = targetY - fromY;
    const len = Math.hypot(dx, dy);
    if (len < 0.01) return;

    const vx = dx / len * 14;
    const vy = dy / len * 14;

    bullets.push({
        x: fromX, y: fromY, vx, vy,
        dmg: wp.dmg, range: wp.range, dist: 0, color: wp.color
    });
}

function updateCombat() {
    // Невидимость после удара
    if (player.invincibleTimer > 0) player.invincibleTimer--;

    // Атака врагов
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        if (Math.abs(dx) < 42 && Math.abs(dy) < 58 && player.invincibleTimer <= 0) {
            const dmgDealt = e.dmg - (player.vehicleType === 0 ? 0 : 2);
            player.hp -= Math.max(5, dmgDealt);
            player.invincibleTimer = 18;
            document.getElementById('hpVal').innerText = Math.max(0, Math.floor(player.hp));

            const flashDiv = document.getElementById('damageFlash');
            flashDiv.style.opacity = '0.5';
            setTimeout(() => flashDiv.style.opacity = '0', 100);

            if (player.hp <= 0) gameOver();
            const pushDir = (player.x - e.x) > 0 ? 1 : -1;
            player.vx += pushDir * 6;
            player.vy = -7;
        }
    }

    // Пули по врагам
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        b.dist += Math.hypot(b.vx, b.vy);

        if (b.x < 0 || b.x > WORLD_W || b.y < 0 || b.y > H || b.dist > b.range) {
            bullets.splice(i, 1);
            i--;
            continue;
        }

        let hitIdx = -1;
        for (let j = 0; j < enemies.length; j++) {
            const e = enemies[j];
            if (Math.hypot(b.x - e.x, b.y - e.y) < e.size / 2 + 8) {
                hitIdx = j;
                break;
            }
        }

        if (hitIdx !== -1) {
            const e = enemies[hitIdx];
            e.hp -= b.dmg;
            if (e.hp <= 0) {
                lootItems.push({ x: e.x, y: e.y - 15, val: e.boss ? 50 : 12 });
                enemies.splice(hitIdx, 1);
                if (e.boss && e.bossType === "final") {
                    showThought("Омега-мутант повержен! Осталось уничтожить источник вируса.", 4000);
                }
            }
            bullets.splice(i, 1);
            i--;
        }
    }
}
// ========== ИНИЦИАЛИЗАЦИЯ И СОБЫТИЯ ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Клавиши
const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, a: false, d: false, w: false, ' ': false };

// Обработчики мыши
canvas.addEventListener('mousedown', (e) => {
    if (!gameActive || gameVictory) return;
    const rect = canvas.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (W / rect.width);
    const sy = (e.clientY - rect.top) * (H / rect.height);
    shoot(sx, sy);
});

// Обработчики клавиатуры
window.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'Escape' && gameActive) exitToMenu();
    if (k === '1') changeVehicle(1);
    if (k === '2') changeVehicle(2);
    if (k === '3') changeVehicle(0);
    if (k === 'e' || k === 'E') destroyVirusSource();
    if (keys.hasOwnProperty(k)) keys[k] = true;
    if (k === ' ') keys[' '] = true;
});

window.addEventListener('keyup', (e) => {
    const k = e.key;
    if (keys.hasOwnProperty(k)) keys[k] = false;
    if (k === ' ') keys[' '] = false;
});

// Кнопки меню
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('exitMenuBtn').addEventListener('click', exitToMenu);
document.getElementById('quitInGame').addEventListener('click', exitToMenu);

// Установка начальной позиции игрока
player.y = GROUND_Y - 48;

// Запуск
function init() {
    exitToMenu();
    draw();
}

init();
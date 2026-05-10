// ========== ИГРОК ==========
const player = {
    x: 250, y: 0,  // y установится позже
    vx: 0, vy: 0,
    width: 32, height: 48,
    onGround: true,
    facingRight: true,
    hp: 100,
    maxHp: 120,
    invincibleTimer: 0,
    weaponId: 1,
    vehicleType: 0
};

const weapons = [
    { name: "Нож", dmg: 15, cooldown: 18, range: 50, color: "#dddddd" },
    { name: "Глок", dmg: 18, cooldown: 12, range: 330, color: "#ffcc55" },
    { name: "Револьвер", dmg: 44, cooldown: 28, range: 380, color: "orange" },
    { name: "M4A1 ⚡", dmg: 27, cooldown: 5, range: 350, color: "cyan" }
];

function updateVehicleUI() {
    const vName = ["Пешком 🚶", "Машина 🚗", "Мотоцикл 🏍️"];
    document.getElementById('vehName').innerHTML = vName[player.vehicleType];
    player.width = (player.vehicleType === 1 ? 40 : (player.vehicleType === 2 ? 35 : 32));
}

function changeVehicle(id) {
    if (id === player.vehicleType) return;
    player.vehicleType = id;
    updateVehicleUI();
}
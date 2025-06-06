// Pixelated Panic - A Space Invaders-style Game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
 
// Game State
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
 
// Player
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 50,
  width: 40,
  height: 20,
  speed: 5,
  bullets: []
};
 
// Enemies
const enemyRows = 4;
const enemyCols = 8;
const enemies = [];
const enemyWidth = 40;
const enemyHeight = 20;
const enemySpacing = 20;
const enemySpeed = 1;
let direction = 1;
 
// Create enemies
for (let r = 0; r < enemyRows; r++) {
  for (let c = 0; c < enemyCols; c++) {
    enemies.push({
      x: c * (enemyWidth + enemySpacing) + 60,
      y: r * (enemyHeight + enemySpacing) + 40,
      width: enemyWidth,
      height: enemyHeight,
      alive: true
    });
  }
}
 
// Handle input
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") rightPressed = true;
  if (e.code === "ArrowLeft") leftPressed = true;
  if (e.code === "Space") spacePressed = true;
});
 
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") rightPressed = false;
  if (e.code === "ArrowLeft") leftPressed = false;
  if (e.code === "Space") spacePressed = false;
});
 
function drawPlayer() {
  ctx.fillStyle = "#0ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
 
function drawEnemies() {
  ctx.fillStyle = "#f00";
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}
 
function drawBullets() {
  ctx.fillStyle = "#ff0";
  player.bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}
 
function updateBullets() {
  player.bullets = player.bullets.filter((bullet) => bullet.y > 0);
  player.bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;
    enemies.forEach((enemy) => {
      if (
        enemy.alive &&
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.alive = false;
        bullet.y = -10; // remove bullet
      }
    });
  });
}
 
function updatePlayer() {
  if (rightPressed && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
  if (leftPressed && player.x > 0) {
    player.x -= player.speed;
  }
  if (spacePressed) {
    spacePressed = false; // prevent spamming
    player.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 7
    });
  }
}
 
function updateEnemies() {
  let shift = false;
  enemies.forEach((enemy) => {
    if (!enemy.alive) return;
    enemy.x += direction * enemySpeed;
    if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
      shift = true;
    }
  });
  if (shift) {
    direction *= -1;
    enemies.forEach((enemy) => {
      enemy.y += 10;
    });
  }
}
 
function drawBackground() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f0";
  ctx.font = "16px monospace";
  ctx.fillText("PIXELATED PANIC", 10, 20);
}
 
function gameLoop() {
  drawBackground();
  updatePlayer();
  updateEnemies();
  updateBullets();
  drawPlayer();
  drawEnemies();
  drawBullets();
  requestAnimationFrame(gameLoop);
}
 
gameLoop();
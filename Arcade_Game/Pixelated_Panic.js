// Pixelated Panic - A Space Invaders-style Game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 750;
// Add this near the top of your script, after your other consts
// hit sound
const hitSound = new Audio('laser-zap-90575.mp3'); // Make sure hit.wav is in your project folder
hitSound.volume = 0.5; // Optional: set volume (0.0 to 1.0)
// player sound
const shootSound = new Audio('laser_gun_sound-40813.mp3'); // Make sure shoot.wav is in your project folder
shootSound.volume = 0.5; // Optional: set volume (0.0 to 1.0)
// Game State
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let gameStarted = false;
let gameWon = false;
let score = 0;
let highScore = parseInt(localStorage.getItem("pixelatedHighScore")) || 0;

// Load Intro Image
const introImage = new Image();
introImage.src = "Pixelated Panic Logo.png"; // <-- Replace with your image path

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

const enemyTypes = ["#3c1", "#c31", "#13c", "#e91e63"];

// Levels configuration
const levels = [
  { rows: 3, cols: 6, speed: 1, spacing: 20 },
  { rows: 4, cols: 8, speed: 1.2, spacing: 18 },
  { rows: 5, cols: 10, speed: 1.5, spacing: 16 },
  { rows: 6, cols: 12, speed: 1.8, spacing: 14 },
  { rows: 7, cols: 14, speed: 2.2, spacing: 12 }
];
let currentLevel = 0;

// Create enemies
function createEnemies() {
  enemies.length = 0;
  const level = levels[currentLevel];
  for (let r = 0; r < level.rows; r++) {
    for (let c = 0; c < level.cols; c++) {
      enemies.push({
        x: c * (enemyWidth + level.spacing) + 60,
        y: r * (enemyHeight + level.spacing) + 40,
        width: enemyWidth,
        height: enemyHeight,
        color: enemyTypes[r % enemyTypes.length],
        alive: true,
        drift: (Math.random() - 0.5) * 0.5
      });
    }
  }
}
createEnemies();

// Update enemySpeed based on level
function getEnemySpeed() {
  return levels[currentLevel].speed;
}

// Handle input
document.addEventListener("keydown", (e) => {
  if (!gameStarted && e.code === "Enter") {
    gameStarted = true;
    gameWon = false;
    score = 0;
    player.bullets = [];
    currentLevel = 0; // Reset to level 1 on new game
    createEnemies();
  }
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
        score += 10; // Add score increment
        if (score > highScore) {
          highScore = score;
          localStorage.setItem("pixelatedHighScore", highScore);
        }
        hitSound.currentTime = 0;
        hitSound.play();
      }
    });
  });
  // Win check
  if (enemies.every(e => !e.alive)) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      player.bullets = [];
      createEnemies();
      direction = 1;
      gameStarted = false;
      setTimeout(() => {
        gameStarted = true;
      }, 1000); // Short pause before next level
    } else {
      gameWon = true;
      gameStarted = false;
    }
  }
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
    shootSound.currentTime = 0; // rewind to start
    shootSound.play();
  }
}

function updateEnemies() {
  let shift = false;
  const enemySpeed = getEnemySpeed();
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
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#232526");
  gradient.addColorStop(1, "#414345");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = Math.random() * 0.5 + 0.5;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Title
  ctx.fillStyle = "#0f0";
  ctx.font = "20px monospace";
  ctx.fillText("PIXELATED PANIC", 10, 30);
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "16px monospace";
  ctx.fillText(`Score: ${score}`, canvas.width - 120, 20);
  ctx.fillText(`High Score: ${highScore}`, canvas.width - 200, 40);
  ctx.fillText(`Level: ${currentLevel + 1}`, 20, 60);
}

// Draw a simple bug (ellipse body, head, legs, antennae)
function drawBug(x, y, width, height, color) {
  // Body
  ctx.fillStyle = color || "#3c1";
  ctx.beginPath();
  ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = "#292";
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2 - height / 2, width / 4, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.strokeStyle = "#f5f";
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y + height / 2);
    ctx.lineTo(x + width / 2 + i * width * 0.7, y + height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width / 2, y + height / 2);
    ctx.lineTo(x + width / 2 + i * width * 0.7, y);
    ctx.stroke();
  }

  // Antennae
  ctx.beginPath();
  ctx.moveTo(x + width / 2 - width / 8, y + height / 2 - height / 2);
  ctx.lineTo(x + width / 2 - width / 4, y + height / 2 - height / 1.2);
  ctx.moveTo(x + width / 2 + width / 8, y + height / 2 - height / 2);
  ctx.lineTo(x + width / 2 + width / 4, y + height / 2 - height / 1.2);
  ctx.stroke();
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    if (enemy.alive) drawBug(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);
  });
}

function drawIntroScreen() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Only draw image if loaded
  if (introImage.complete && introImage.naturalWidth !== 0) {
    ctx.drawImage(introImage, canvas.width / 2 - 300, 80, 600, 400);
  }
  ctx.fillStyle = "#0f0";
  ctx.font = "30px monospace";
  ctx.fillText("Pixelated Panic", canvas.width / 2 - 120, 520);
  ctx.fillStyle = "#fff";
  ctx.font = "20px monospace";
  ctx.fillText("Press ENTER to Start", canvas.width / 2 - 110, 570);
  ctx.font = "18px monospace";
  ctx.fillText(`Level: ${currentLevel + 1} / ${levels.length}`, canvas.width / 2 - 60, 610);
}

function gameLoop() {
  if (!gameStarted) {
    drawIntroScreen();
    requestAnimationFrame(gameLoop);
    return;
  }

  drawBackground();
  updatePlayer();
  updateEnemies();
  updateBullets();
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawScore();

  requestAnimationFrame(gameLoop);
}

gameLoop();
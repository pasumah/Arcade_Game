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

// Draw a simple bug (ellipse body, head, legs, antennae)
function drawBug(x, y, width, height) {
  // Body
  ctx.fillStyle = "#3c1";
  ctx.beginPath();
  ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = "#292";
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2 - height / 2, width / 4, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.strokeStyle = "#222";
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
    if (enemy.alive) {
      drawBug(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}
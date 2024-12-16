// Canvas Setup
const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

// Assets
const playerImg = new Image();
playerImg.src = "./assets/player.png";

const platformImg = new Image();
platformImg.src = "./assets/platform.png";

const bgImg = new Image();
bgImg.src = "./assets/background.jpg";

// Player Properties
const player = {
  x: 50,
  y: 500,
  width: 50,
  height: 50,
  dx: 0,
  dy: 0,
  speed: 5,
  gravity: 0.8,
  jumpPower: -15,
  grounded: false,
};

// Platforms
const platforms = [
  { x: 0, y: 550, width: 800, height: 50 },
  { x: 300, y: 400, width: 200, height: 20 },
  { x: 600, y: 300, width: 150, height: 20 },
];

// Draw Background
function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

// Draw Player
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Draw Platforms
function drawPlatforms() {
  platforms.forEach(platform => {
    ctx.drawImage(platformImg, platform.x, platform.y, platform.width, platform.height);
  });
}

// Move Player
function movePlayer() {
  player.y += player.dy;
  player.x += player.dx;

  if (!player.grounded) player.dy += player.gravity;

  // Check Boundaries
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.grounded = true;
    player.dy = 0;
  } else {
    player.grounded = false;
  }
}

// Collision Detection
function checkCollisions() {
  platforms.forEach(platform => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height < platform.y + 10 &&
      player.y + player.height > platform.y
    ) {
      player.y = platform.y - player.height;
      player.grounded = true;
      player.dy = 0;
    }
  });
}

// Game Loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlatforms();
  drawPlayer();
  movePlayer();
  checkCollisions();
  requestAnimationFrame(update);
}

// Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === " " && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") player.dx = 0;
});

// Start Game
update();

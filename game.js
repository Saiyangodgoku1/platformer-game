const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 400;
const ctx = canvas.getContext("2d");

// Assets
const explorerImages = {
  run: [new Image(), new Image()],
  jump: new Image(),
  duck: new Image(),
};
explorerImages.run[0].src = "./assets/explorer/run1.png";
explorerImages.run[1].src = "./assets/explorer/run2.png";
explorerImages.jump.src = "./assets/explorer/jump.png";
explorerImages.duck.src = "./assets/explorer/duck.png";

const dinoImages = [new Image(), new Image()];
dinoImages[0].src = "./assets/dinosaur/run1.png";
dinoImages[1].src = "./assets/dinosaur/run2.png";

const rockImg = new Image();
rockImg.src = "./assets/obstacles/rock.png";

const birdImg = new Image();
birdImg.src = "./assets/obstacles/bird.png";

const roadImg = new Image();
roadImg.src = "./assets/background/desert-road.png";

// Game Variables
let explorer = { x: 100, y: 300, width: 50, height: 50, lane: 2, speed: 3, dy: 0, jump: false, duck: false };
let dino = { x: 50, y: 150, width: 80, height: 80, frame: 0 };
let obstacles = [];
let gameSpeed = 3;
let frame = 0;

// Draw Explorer
function drawExplorer() {
  const image = explorer.jump
    ? explorerImages.jump
    : explorer.duck
    ? explorerImages.duck
    : explorerImages.run[frame % 2];
  ctx.drawImage(image, explorer.x, explorer.y, explorer.width, explorer.height);
}

// Draw Dinosaur
function drawDino() {
  ctx.drawImage(dinoImages[dino.frame % 2], dino.x, dino.y, dino.width, dino.height);
}

// Draw Obstacles
function drawObstacles() {
  obstacles.forEach(obs => {
    const img = obs.type === "rock" ? rockImg : birdImg;
    ctx.drawImage(img, obs.x, obs.y, obs.width, obs.height);
  });
}

// Move Obstacles
function moveObstacles() {
  obstacles.forEach(obs => (obs.x -= gameSpeed));
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}

// Add Obstacles
function addObstacle() {
  const type = Math.random() < 0.5 ? "rock" : "bird";
  if (type === "rock") {
    obstacles.push({ x: 800, y: 300, width: 50, height: 50, type: "rock" });
  } else {
    obstacles.push({ x: 800, y: 200, width: 50, height: 30, type: "bird" });
  }
}

// Update Explorer
function updateExplorer() {
  if (explorer.jump) {
    explorer.dy += 0.5; // Gravity
    explorer.y += explorer.dy;
    if (explorer.y >= 300) {
      explorer.y = 300;
      explorer.jump = false;
    }
  }
}

// Key Handlers
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && explorer.lane > 1 && !explorer.jump) {
    explorer.lane -= 1;
    explorer.y -= 50;
  } else if (e.key === "ArrowDown") {
    if (explorer.jump) return;
    if (e.repeat) return; // Duck only once
    explorer.duck = true;
    explorer.height = 30; // Shrink height
  } else if (e.key === " " && !explorer.jump) {
    explorer.jump = true;
    explorer.dy = -10; // Jump power
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowDown") {
    explorer.duck = false;
    explorer.height = 50; // Restore height
  }
});

// Game Loop
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(roadImg, 0, 350, 800, 50);

  drawExplorer();
  drawDino();
  drawObstacles();

  moveObstacles();
  updateExplorer();

  if (frame % 150 === 0) addObstacle();
  frame++;
  if (frame % 60 === 0) gameSpeed += 0.1; // Increase speed gradually

  requestAnimationFrame(updateGame);
}

// Start Game
updateGame();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const powerSlider = document.getElementById('power');
const powerValue = document.getElementById('powerValue');
const fireBtn = document.getElementById('fireBtn');
const resetBtn = document.getElementById('resetBtn');
const feedback = document.getElementById('feedback');

// Game variables
let cannonX = 50;
let cannonY = canvas.height - 50;
let targetX = canvas.width - 100;
let targetY = canvas.height - 50;
let projectile = null;
let gravity = 0.5;
let isFiring = false;
let score = 0;
let targetHit = true; // initial red

// Cannon drawing
function drawCannon() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(cannonX - 10, cannonY - 10, 20, 20);
    ctx.fillStyle = '#000';
    ctx.fillRect(cannonX, cannonY - 5, 30, 10);
}

// Target drawing
function drawTarget() {
    ctx.fillStyle = targetHit ? '#FF0000' : '#00FF00'; // Red if hit, green otherwise
    ctx.beginPath();
    ctx.arc(targetX, targetY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 10, 0, Math.PI * 2);
    ctx.fill();
}

// Projectile class
class Projectile {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
    }

    draw() {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    checkCollision() {
        const dx = this.x - targetX;
        const dy = this.y - targetY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + 20;
    }
}

// Explosion effect
function drawExplosion(x, y) {
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const radius = Math.random() * 30 + 10;
        const ex = x + Math.cos(angle) * radius;
        const ey = y + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(ex, ey, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCannon();
    drawTarget();

    if (projectile) {
        projectile.update();
        projectile.draw();

        if (projectile.checkCollision()) {
            drawExplosion(projectile.x, projectile.y);
            targetHit = true; // change to red on hit
            score += 100;
            feedback.textContent = `Hit! Score: ${score}`;
            projectile = null;
            isFiring = false;
            // Reset to green after 1 second
            setTimeout(() => {
                targetHit = false;
            }, 1000);
        } else if (projectile.y > canvas.height || projectile.x > canvas.width) {
            feedback.textContent = `Missed! Score: ${score}`;
            projectile = null;
            isFiring = false;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
powerSlider.addEventListener('input', () => {
    powerValue.textContent = powerSlider.value;
});

fireBtn.addEventListener('click', () => {
    if (!isFiring) {
        const power = parseInt(powerSlider.value) * 2; // Increased power multiplier
        const angle = Math.PI / 4; // 45 degrees
        const vx = power * Math.cos(angle) * 0.1;
        const vy = -power * Math.sin(angle) * 0.1;
        projectile = new Projectile(cannonX + 30, cannonY, vx, vy);
        isFiring = true;
    }
});

resetBtn.addEventListener('click', () => {
    projectile = null;
    isFiring = false;
    score = 0;
    targetHit = false;
    feedback.textContent = '';
    targetX = Math.random() * (canvas.width - 200) + 100;
});

// Initialize
gameLoop();
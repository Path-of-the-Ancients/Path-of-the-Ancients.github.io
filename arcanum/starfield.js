// Starfield Background Module
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.brightness = 0.6 + Math.random() * 0.4;
    this.twinkleSpeed = 0.005 + Math.random() * 0.008;
    this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
  }
  update() {
    this.brightness += this.twinkleSpeed * this.twinkleDirection;
    if (this.brightness >= 1 || this.brightness <= 0.6)
      this.twinkleDirection *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(171, 156, 84, ${this.brightness})`;
    ctx.fill();
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 300 }, () => new Star());
}
function animateStars() {
  ctx.fillStyle = '#0a0005';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => { star.update(); star.draw(); });
  requestAnimationFrame(animateStars);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateStars();

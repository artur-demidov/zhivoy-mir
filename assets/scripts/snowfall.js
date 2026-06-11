const canvas = document.getElementById('snowfall');
const screen = document.getElementById('section-hero');
const ctx = canvas.getContext('2d');
const ratio = window.devicePixelRatio || 1;

// Виртуальный размер с учетом плотности пикселей
const virtualSize = {
  width: screen.clientWidth - 1, // Хак для исправления дробного размера элемента
  height: screen.clientHeight,
};

// Реальный размер пикселей дисплея
const pixelSize = {
  width: virtualSize.width * ratio,
  height: virtualSize.height * ratio,
};

const updateCanvasSize = () => {
  canvas.width = pixelSize.width;
  canvas.height = pixelSize.height;

  canvas.style.width = `${virtualSize.width}px`;
  canvas.style.height = `${virtualSize.height}px`;

  ctx.scale(ratio, ratio);
};

updateCanvasSize();

// Массив снежинок
const snowflakes = [];
const snowflakeCount = 100;

// Класс снежинки
class Snowflake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * virtualSize.width;
    this.y = Math.random() * virtualSize.height - virtualSize.height;
    this.radius = Math.random() * 3 + 1;
    this.speed = Math.random();
    this.drift = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.5;
  }

  update() {
    this.y += this.speed;
    this.x += this.drift;

    // Если снежинка вышла за границы, сбрасываем её наверх
    if (this.y > virtualSize.height) {
      this.y = -10;
      this.x = Math.random() * virtualSize.width;
    }

    if (this.x > virtualSize.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = virtualSize.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 220, 255, ${this.opacity})`;
    ctx.fill();
  }
}

// Создаём снежинки
for (let i = 0; i < snowflakeCount; i++) {
  snowflakes.push(new Snowflake());
}

// Анимация
function animate() {
  ctx.clearRect(0, 0, virtualSize.width, virtualSize.height);

  snowflakes.forEach((snowflake) => {
    snowflake.update();
    snowflake.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  virtualSize.width = screen.clientWidth - 1; // Хак для исправления дробного размера элемента
  virtualSize.height = screen.clientHeight;
  pixelSize.width = virtualSize.width * ratio;
  pixelSize.height = virtualSize.height * ratio;
  updateCanvasSize();
});

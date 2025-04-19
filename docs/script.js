let activeColor = 'red';
let score = 0;
let sideOfSquare = 50;
let showAnimation = true;

document.querySelectorAll('#color-buttons button').forEach(button => {
  button.addEventListener('click', () => {

    document.querySelectorAll('#color-buttons button').forEach(b => {
      b.classList.remove('selected');
    });

    button.classList.add('selected');

    activeColor = button.dataset.color;
  });
});

document.querySelectorAll('#difficulty-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    sideOfSquare = parseInt(button.dataset.size);

    document.querySelectorAll('#difficulty-buttons button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    score = 0;
    updateScore();
    calculateGridSize();
    drawGrid();
    generateRandomGroups();
  });
});

const animationButton = document.getElementById('toggle-visual');
animationButton.addEventListener('click', () => {
  showAnimation = !showAnimation;
  animationButton.classList.toggle('active', showAnimation);
});

const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let cols, rows;

const vizinhos = [
  [1, 0], [-1, 0], [0, -1], [0, 1]
];

const colors = ['red', 'blue', 'green', 'yellow'];

const calculateGridSize = () => {
  const availableWidth = window.innerWidth * 0.8;
  const availableHeight = window.innerHeight * 0.75;
  
  cols = Math.floor(availableWidth / sideOfSquare);
  rows = Math.floor(availableHeight / sideOfSquare);
  
  canvas.width = cols * sideOfSquare;
  canvas.height = rows * sideOfSquare;
};

const drawGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(y * sideOfSquare, x * sideOfSquare, sideOfSquare, sideOfSquare);
    }
  }
};

const fillCell = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(y * sideOfSquare, x * sideOfSquare, sideOfSquare, sideOfSquare);
};

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const bfs = async (startX, startY) => {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const fila = [[startX, startY]];
  visited[startX][startY] = true;

  const startColor = ctx.getImageData(startY * sideOfSquare, startX * sideOfSquare, 1, 1).data;
  const isSameColor = (data) =>
    data[0] === startColor[0] &&
    data[1] === startColor[1] &&
    data[2] === startColor[2];

  while (fila.length > 0) {
    const [x, y] = fila.shift();

    fillCell(x, y, activeColor);
    if (showAnimation) await delay(1);

    for (const [dx, dy] of vizinhos) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < rows &&
        ny >= 0 && ny < cols &&
        !visited[nx][ny]
      ) {
        const neighborColor = ctx.getImageData(ny * sideOfSquare, nx * sideOfSquare, 1, 1).data;

        if (isSameColor(neighborColor)) {
          visited[nx][ny] = true;
          fila.push([nx, ny]);
        }
      }
    }
  }
};

const generateRandomGroups = () => {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (visited[x][y]) continue;

      const color = colors[Math.floor(Math.random() * colors.length)];
      const queue = [[x, y]];
      visited[x][y] = true;

      while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        fillCell(cx, cy, color);

        for (const [dx, dy] of vizinhos) {
          const nx = cx + dx;
          const ny = cy + dy;

          if (
            nx >= 0 && nx < rows &&
            ny >= 0 && ny < cols &&
            !visited[nx][ny] &&
            Math.random() < 0.45
          ) {
            visited[nx][ny] = true;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }
};

const updateScore = () => {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Buscas: ${score}`;
};

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientY - rect.top) / sideOfSquare);
  const y = Math.floor((event.clientX - rect.left) / sideOfSquare);
  updateScore(score++);
  bfs(x, y);
});

calculateGridSize();
drawGrid();
generateRandomGroups();

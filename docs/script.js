let activeColor = 'red'; // cor padrão
let score = 0; // Contador para a pontuação
const sideOfSquare = 10;

// Adicionando o evento para destacar o botão clicado
document.querySelectorAll('#color-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    // Remove a classe 'selected' de todos os botões
    document.querySelectorAll('#color-buttons button').forEach(b => {
      b.classList.remove('selected');
    });

    // Adiciona a classe 'selected' ao botão clicado
    button.classList.add('selected');

    // Atualiza a cor ativa
    activeColor = button.dataset.color;
  });
});

const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let cols, rows;

const vizinhos = [
  [1, 0], [-1, 0], [0, -1], [0, 1]
];

const colors = ['red', 'blue', 'green', 'yellow'];

// Função para calcular o tamanho do grid com base no tamanho da tela
const calculateGridSize = () => {
  const availableWidth = window.innerWidth * 0.8;
  const availableHeight = window.innerHeight * 0.75;
  
  cols = Math.floor(availableWidth / sideOfSquare);
  rows = Math.floor(availableHeight / sideOfSquare);
  
  canvas.width = cols * sideOfSquare;
  canvas.height = rows * sideOfSquare;
};

// Função para desenhar a grid no canvas
const drawGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(y * sideOfSquare, x * sideOfSquare, sideOfSquare, sideOfSquare);
    }
  }
};

// Função para preencher a célula no canvas
const fillCell = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(y * sideOfSquare, x * sideOfSquare, sideOfSquare, sideOfSquare);
};

// Função delay para controle da animação
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

    fillCell(x, y, activeColor); // pinta com a cor selecionada
    await delay(1);

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

//Gera regioes agrupadas de diversas cores
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
            Math.random() < 0.47 // taxa de agrupamento
          ) {
            visited[nx][ny] = true;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }
};

// Atualizando o score na tela
const updateScore = () => {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score: ${score}`;
};

// Quando o canvas é clicado, inicia o flood fill e incrementa o score
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientY - rect.top) / sideOfSquare);
  const y = Math.floor((event.clientX - rect.left) / sideOfSquare);
  updateScore(score++);
  bfs(x, y); // Inicia a BFS no quadrado clicado
});

calculateGridSize();
drawGrid();
generateRandomGroups();

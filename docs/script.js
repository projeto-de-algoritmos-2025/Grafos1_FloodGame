const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const sideOfSquare = 20;
let cols, rows;

const vizinhos = [
  [1, 0], [-1, 0], [0, -1], [0, 1]
];

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
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// BFS
const bfs = async (startX, startY) => {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const fila = [[startX, startY]];
  visited[startX][startY] = true;
  
  while (fila.length > 0) {
    const [x, y] = fila.shift();
    
    fillCell(x, y, 'red'); // Pinta a célula de vermelho
    await delay(1); // Espera para a animação não ser instantânea

    for (const [dx, dy] of vizinhos) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < rows &&
        ny >= 0 && ny < cols &&
        !visited[nx][ny]
      ) {
        visited[nx][ny] = true;
        fila.push([nx, ny]);
      }
    }
  }
};

// Quando o canvas é clicado, inicia o flood fill
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientY - rect.top) / sideOfSquare);
  const y = Math.floor((event.clientX - rect.left) / sideOfSquare);
  bfs(x, y); // Inicia a BFS no quadrado clicado
});

// Inicializa a grid
calculateGridSize();
drawGrid();

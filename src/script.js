document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('grid-container');

    const sideOfSquare = 10

    const calculateGridSize = () => {
        const availableWidth = window.innerWidth*0.7;
        const availableHeight = window.innerHeight*0.6;
        
        const cols = Math.floor(availableWidth / sideOfSquare);
        const rows = Math.floor(availableHeight / sideOfSquare);
        
        return { cols, rows };
    };

    const createGrid = () => {
        gridContainer.innerHTML = '';

        const { cols, rows } = calculateGridSize();
        
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${sideOfSquare}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${sideOfSquare}px)`;
        
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.style.width = sideOfSquare
                square.style.height = sideOfSquare
                
                square.id = `${x}-${y}`;
                square.dataset.x = x;
                square.dataset.y = y;
                
                gridContainer.appendChild(square);
            }
        }
    };

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const percorreVertical = async (colour) => {
        const { cols, rows } = calculateGridSize();
        let square;

        for (let y = 0; y < cols; y++) {
            for (let x = 0; x < rows; x++) {

                square = document.getElementById(`${x}-${y}`)
                square.style.backgroundColor = colour
                await delay(1)
            }
        }
    }

    const percorreHorizontal = async (colour) => {
        const { cols, rows } = calculateGridSize();
        let square;

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {

                square = document.getElementById(`${x}-${y}`)
                square.style.backgroundColor = colour
                await delay(1)
            }
        }
    }
    
    createGrid();
    while(true){
        await percorreHorizontal("#000000");
        await percorreVertical("#ffffff");
    }
    window.addEventListener('resize', createGrid);
});

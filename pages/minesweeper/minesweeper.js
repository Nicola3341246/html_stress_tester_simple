// script.js
const GRID_SIZE = 30;
const MINE_COUNT = 200;
let grid = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let remainingMines = MINE_COUNT;
let isFirstClick = true;
let startTime = 0;
let timerInterval = null;

function initGame() {
    grid = [];
    revealed = [];
    flagged = [];
    gameOver = false;
    remainingMines = MINE_COUNT;
    isFirstClick = true;
    
    // Initialize empty grid
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = [];
        revealed[i] = [];
        flagged[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = 0;
            revealed[i][j] = false;
            flagged[i][j] = false;
        }
    }

    updateDisplay();
    document.querySelector(".winScreen").style.display = "none";
    updateMineCount();
    stopTimer();
    startTimer();
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function getFormattedTimeString() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function placeMines(firstX, firstY) {
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        
        const tooClose = Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1;
        
        if (!tooClose && grid[x][y] !== -1) {
            grid[x][y] = -1;
            minesPlaced++;
        }
    }

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] !== -1) {
                grid[i][j] = countAdjacentMines(i, j);
            }
        }
    }
}

function countAdjacentMines(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                if (grid[newX][newY] === -1) count++;
            }
        }
    }
    return count;
}

function updateDisplay() {
    const gridElement = document.getElementById('minesweeper-grid');
    gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 40px)`;
    gridElement.innerHTML = '';

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'minesweeper-cell';
            cell.dataset.x = i;
            cell.dataset.y = j;
            
            if (revealed[i][j]) {
                cell.classList.add('minesweeper-revealed');
                if (grid[i][j] === -1) {
                    cell.classList.add('minesweeper-mine');
                } else if (grid[i][j] > 0) {
                    cell.textContent = grid[i][j];
                    cell.classList.add(`minesweeper-number-${grid[i][j]}`);
                }
            } else if (flagged[i][j]) {
                cell.classList.add('minesweeper-flagged');
            }

            cell.addEventListener('click', handleClick);
            cell.addEventListener('contextmenu', handleRightClick);
            gridElement.appendChild(cell);
        }
    }
}

function handleClick(event) {
    if (gameOver) return;
    
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    if (flagged[x][y]) return;
    
    if (isFirstClick) {
        placeMines(x, y);
        isFirstClick = false;
        startTimer();
    }
    
    if (grid[x][y] === -1) {
        gameOver = true;
        revealAll();
        document.getElementById('minesweeper-game-status').textContent = 'Game Over!';
        return;
    }

    revealCell(x, y);
    updateDisplay();
    checkWin();
}

function handleRightClick(event) {
    event.preventDefault();
    if (gameOver) return;

    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    if (revealed[x][y]) return;

    flagged[x][y] = !flagged[x][y];
    remainingMines += flagged[x][y] ? -1 : 1;
    updateDisplay();
    updateMineCount();
}

function revealCell(x, y) {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE || revealed[x][y] || flagged[x][y]) return;

    revealed[x][y] = true;

    if (grid[x][y] === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(x + i, y + j);
            }
        }
    }
}

function revealAll() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            revealed[i][j] = true;
        }
    }
    updateDisplay();
}

function checkWin() {
    let unrevealedSafeCells = false;
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (!revealed[i][j] && grid[i][j] !== -1) {
                unrevealedSafeCells = true;
                break;
            }
        }
    }
    
    if (!unrevealedSafeCells) {
        gameOver = true;
        stopTimer();
        renderWinScreen();
    }
}

function updateTimer() {
    if (!gameOver) {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        document.getElementById('StopWatchDisplay').textContent = 
            `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateMineCount() {
    const flaggedCount = flagged.flat().filter(Boolean).length;
    document.getElementById('MinesDisplay').textContent = `Mines: ${flaggedCount}/${MINE_COUNT}`;
}

function renderWinScreen() {
    const winScreen = document.querySelector(".winScreen");
    const winDetails = winScreen.querySelector(".winDetails");
    winDetails.innerHTML = ''; // Clear previous details

    const timerField = document.createElement("div");
    const flagsField = document.createElement("div");

    timerField.innerText = `Time: ${getFormattedTimeString()}`;
    flagsField.innerText = `Mines Found: ${MINE_COUNT}/${MINE_COUNT}`;

    winScreen.style.display = "flex";
    winDetails.appendChild(timerField);
    winDetails.appendChild(flagsField);
}


document.addEventListener('DOMContentLoaded', initGame);
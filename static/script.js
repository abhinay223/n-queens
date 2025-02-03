const chessboard = document.getElementById('chessboard');
const resetButton = document.getElementById('resetButton');
const statusMessage = document.getElementById('statusMessage');

const BOARD_SIZE = 8;

// update status message
function updateStatusMessage(message, success = true) {
    statusMessage.textContent = message;
    statusMessage.style.color = success ? 'green' : 'red';
}

// `/place` API to place a queen
function placeQueen(row, col, cell) {
    fetch('http://127.0.0.1:5000/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row: row, col: col })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                cell.innerHTML = '♛';
                cell.classList.add('queen');
                updateStatusMessage(data.message, true);
            } else {
                updateStatusMessage(data.message, false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            updateStatusMessage('Failed to communicate with the server.', false);
        });
}

// `/reset` API to reset the board
function resetBoard() {
    fetch('http://127.0.0.1:5000/reset', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            updateStatusMessage(data.message, true);

            // Clear the frontend chessboard
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.classList.remove('queen');
            });
        })
        .catch(error => {
            console.error('Error:', error);
            updateStatusMessage('Failed to reset the board.', false);
        });
}

// 8x8 chessboard
function createChessboard() {
    chessboard.innerHTML = ''; // Clear existing cells
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

         // cell colors
            if ((row + col) % 2 === 0) {
                cell.style.backgroundColor = '#030303';
            } else {
                cell.style.backgroundColor = '#eae4e4';
            }

            
            cell.addEventListener('click', () => {
                placeQueen(row, col, cell);
            });

            chessboard.appendChild(cell);
        }
    }
}


createChessboard();


resetButton.addEventListener('click', resetBoard);

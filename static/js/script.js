
document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');

    let gameComplete = false;
    let puzzleActive = false;
    const startButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    const gameMessage = document.getElementById('game-message');

    const knightStart = { row: 7, col: 1 };
    const goalSquare = { row: 4, col: 2 };
    let knightPosition = { ...knightStart };
    let movesLeft = 3;

    envelope.addEventListener('click', () => {
        if (!gameComplete) {
            gameMessage.textContent = 'Solve the chess puzzle first, then open your letter.';
            gameMessage.style.color = '#d35400';
            return;
        }

        if (envelope.classList.contains('close')) {
            envelope.classList.remove('close');
            envelope.classList.add('open');
        } else {
            envelope.classList.remove('open');
            envelope.classList.add('close');
        }
    });

    startButton.addEventListener('click', () => {
        gameComplete = false;
        puzzleActive = true;
        knightPosition = { ...knightStart };
        movesLeft = 3;
        gameMessage.textContent = 'Help the knight reach the glowing square in 3 moves.';
        gameMessage.style.color = '#5d4037';
        gameBoard.classList.remove('hidden');
        startButton.textContent = 'Restart puzzle';
        renderChessPuzzle();
    });

    gameBoard.addEventListener('click', (event) => {
        if (!puzzleActive || gameComplete) return;

        const square = event.target.closest('.square');
        if (!square) return;

        const row = Number(square.dataset.row);
        const col = Number(square.dataset.col);
        const validMoves = getValidKnightMoves(knightPosition);
        const isValid = validMoves.some(move => move.row === row && move.col === col);

        if (!isValid) {
            gameMessage.textContent = 'That is not a valid knight move. Try again.';
            gameMessage.style.color = '#d35400';
            return;
        }

        knightPosition = { row, col };
        movesLeft -= 1;

        if (row === goalSquare.row && col === goalSquare.col) {
            gameComplete = true;
            puzzleActive = false;
            gameMessage.textContent = 'Checkmate! Your letter is unlocked, now tap the envelope.';
            gameMessage.style.color = '#27ae60';
            renderChessPuzzle();
            return;
        }

        if (movesLeft === 0) {
            puzzleActive = false;
            gameMessage.textContent = 'Almost there, but the knight didn\'t reach the goal. Restart to try again.';
            gameMessage.style.color = '#d35400';
            renderChessPuzzle();
            return;
        }

        gameMessage.textContent = `Good move! ${movesLeft} move${movesLeft === 1 ? '' : 's'} left.`;
        gameMessage.style.color = '#5d4037';
        renderChessPuzzle();
    });

    function renderChessPuzzle() {
        gameBoard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${((row + col) % 2 === 0) ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                if (row === goalSquare.row && col === goalSquare.col) {
                    square.classList.add('goal');
                    const marker = document.createElement('div');
                    marker.className = 'piece goal-marker';
                    marker.textContent = 'Goal';
                    square.appendChild(marker);
                }

                if (row === knightPosition.row && col === knightPosition.col) {
                    const knight = document.createElement('div');
                    knight.className = 'piece knight';
                    knight.textContent = '♞';
                    square.appendChild(knight);
                }

                if (puzzleActive && !gameComplete) {
                    const validMoves = getValidKnightMoves(knightPosition);
                    const isValid = validMoves.some(move => move.row === row && move.col === col);
                    if (isValid) {
                        square.classList.add('valid');
                    }
                }

                gameBoard.appendChild(square);
            }
        }
    }

    function getValidKnightMoves(position) {
        const offsets = [
            { row: -2, col: -1 },
            { row: -2, col: 1 },
            { row: -1, col: -2 },
            { row: -1, col: 2 },
            { row: 1, col: -2 },
            { row: 1, col: 2 },
            { row: 2, col: -1 },
            { row: 2, col: 1 }
        ];

        return offsets
            .map(offset => ({ row: position.row + offset.row, col: position.col + offset.col }))
            .filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8);
    }

    // Create moving butterflies
    const container = document.getElementById('butterfly-box');
    const colors = ['#ff85a2', '#ffeb3b', '#b2ff59', '#81d4fa'];

    for (let i = 0; i < 8; i++) {
        createButterfly();
    }

    function createButterfly() {
        const b = document.createElement('div');
        b.className = 'butterfly';
        b.style.left = Math.random() * 100 + 'vw';
        b.style.top = Math.random() * 100 + 'vh';
        b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(b);

        animateButterfly(b);
    }

    function animateButterfly(el) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 5000 + Math.random() * 5000;

        el.animate([
            { transform: `translate(0, 0) rotate(45deg)` },
            { transform: `translate(${x}px, ${y}px) rotate(${45 + Math.random() * 90}deg)` }
        ], {
            duration: duration,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
    }
});

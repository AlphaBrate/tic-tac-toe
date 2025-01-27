const stastics = {
    moves: {
        X: [],
        O: []
    },
    win: {
        X: 0,
        O: 0
    },
    draw: 0
};



let moveCount = 0;

const searchParams = new URLSearchParams(window.location.search);

const nested = parseInt(searchParams.get('nested')),
    size = parseInt(searchParams.get('size'));

if (nested && size) {
    setGame(nested, size);
} else {
    window.location.href = '/';
}

function createBoard(size, target, depth) {
    if (!(target instanceof Element)) {
        console.error('Target is not a valid DOM element.');
        return;
    }

    const board = document.createElement('div');
    board.classList.add('board');

    let array = [];

    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        let arrayRow = [];

        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = `${100 / size}%`;

            row.appendChild(cell);
            arrayRow.push(cell);
        }

        board.appendChild(row);
        array.push(arrayRow);
    }

    target.appendChild(board);

    return { boardElement: board, cells: array };
}

function setGame(nested, size) {
    const game = document.querySelector('.game');
    if (!game) {
        console.error('Game container not found.');
        return;
    }

    const topLevelBoard = createBoard(size, game, 0);

    function generateNestedBoards(boardData, currentDepth, maxDepth) {
        if (currentDepth >= maxDepth) return;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = boardData.cells[i][j];
                if (cell instanceof Element) {
                    const nestedBoardData = createBoard(size, cell, currentDepth + 1);
                    generateNestedBoards(nestedBoardData, currentDepth + 1, maxDepth);
                } else {
                    console.error('Cell is not a valid DOM element.');
                }
            }
        }
    }

    generateNestedBoards(topLevelBoard, 0, nested - 1);

    let deepest = document.querySelector('.board');
    while (true) {
        // If there are no more nested boards, we've reached the deepest board
        if (!deepest.querySelector('.board')) break;
        deepest = deepest.querySelector('.board');
    }

    deepest.classList.add('playable');

    setTimeout(() => {
        zoomToBoard(game, deepest);
        playingBoard = deepest;
    }, 0);

    // Add X and O game logic to the deepest board
    addGameLogic(deepest, nested, size);
}

let zoomed = false;

async function resetZoom(game, setIcon = true) {
    // get transition duration
    zoomed = false;
    const style = getComputedStyle(game);
    const duration = parseFloat(style.transitionDuration) * 1000;

    if (setIcon) {
        document.querySelector('.zoom-in-out-animted').classList.toggle('zoom-in');
    }

    // reset zoom
    game.style.transform = 'scale(1) translate(0, 0)';

    // wait for transition to end
    await new Promise(resolve => setTimeout(resolve, duration));
}

function zoomToBoard(game, deepest, setIcon = true) {
    if (!game || !deepest) return;

    zoomed = true;

    if (setIcon) {
        document.querySelector('.zoom-in-out-animted').classList.toggle('zoom-in');
    }

    const gameRect = game.getBoundingClientRect();
    const deepestRect = deepest.getBoundingClientRect();

    // centers
    const gameCenterX = gameRect.left + gameRect.width / 2;
    const gameCenterY = gameRect.top + gameRect.height / 2;

    const deepestCenterX = deepestRect.left + deepestRect.width / 2;
    const deepestCenterY = deepestRect.top + deepestRect.height / 2;

    const scale = gameRect.width / deepestRect.width;
    const translateX = gameCenterX - deepestCenterX;
    const translateY = gameCenterY - deepestCenterY;

    game.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
}


let player = 'X';
let playingBoard = null;

function addGameLogic(deepest, nested, size) {
    const cells = deepest.querySelectorAll('.cell');
    let currentPlayer = 'X'; // Start with player X
    moveCount = 0;

    cells.forEach(cell => {
        cell.addEventListener('click', () => {

            // toggle --source-image from cross.svg to circle.svg url(../assets/cross.svg)  
            const url = currentPlayer === 'X' ? 'url(./assets/circle.svg)' : 'url(./assets/cross.svg)';
            document.querySelector('.current-player').style.backgroundImage = url;

            if (!cell.getAttribute('data-occupied')) {
                cell.classList.add(currentPlayer.toLowerCase()); // Add class for styling
                moveCount++;

                // add to statistics
                stastics.moves[currentPlayer].push(cell);

                // data-occupied
                cell.setAttribute('data-occupied', currentPlayer);

                // Check for a draw
                if (!checkWin(deepest, 'X', size) && !checkWin(deepest, 'O', size) && moveCount === size * size) {
                    pujs.alert('It\'s a draw!');

                    // add to statistics
                    stastics.draw++;

                    setTimeout(() => {
                        resetBoard(deepest);
                    }, 1000);
                    return;
                }

                // Check for a win
                if (checkWin(deepest, currentPlayer, size)) {
                    pujs.alert(`Player ${currentPlayer} wins!`, 'success');

                    // add to statistics

                    stastics.win[currentPlayer]++;

                    // find winning cells and create a line

                    // winning cells

                    // three in a row, three in a column, two diagonals
                    const cells = deepest.querySelectorAll('.cell');
                    const boardSize = size;

                    // Convert NodeList to a 2D array for easier checking
                    const grid = [];
                    for (let i = 0; i < boardSize; i++) {
                        grid.push([]);
                        for (let j = 0; j < boardSize; j++) {
                            grid[i].push(cells[i * boardSize + j]);
                        }
                    }

                    const winningCells = [];
                    // Check rows

                    // Check rows
                    for (let i = 0; i < boardSize; i++) {
                        if (grid[i].every(cell => cell.getAttribute('data-occupied') === currentPlayer)) {
                            grid[i].forEach(cell => winningCells.push(cell));
                            break;
                        }
                    }

                    // Check columns
                    for (let j = 0; j < boardSize; j++) {
                        if (grid.every(row => row[j].getAttribute('data-occupied') === currentPlayer)) {
                            grid.forEach(row => winningCells.push(row[j]));
                            break;
                        }
                    }

                    // Check diagonals
                    if (grid.every((row, index) => row[index].getAttribute('data-occupied') === currentPlayer)) {
                        grid.forEach((row, index) => winningCells.push(row[index]));
                    }

                    if (grid.every((row, index) => row[boardSize - 1 - index].getAttribute('data-occupied') === currentPlayer)) {
                        grid.forEach((row, index) => winningCells.push(row[boardSize - 1 - index]));
                    }


                    // create line

                    const line = document.createElement('div');

                    // get the first and last cell
                    const firstCell = winningCells[0];
                    const lastCell = winningCells[winningCells.length - 1];

                    // calculate line position and size
                    const lineX = firstCell.offsetLeft + firstCell.offsetWidth / 2;
                    const lineY = firstCell.offsetTop + firstCell.offsetHeight / 2;

                    const lineLength = Math.sqrt(
                        Math.pow(lastCell.offsetLeft - firstCell.offsetLeft, 2) +
                        Math.pow(lastCell.offsetTop - firstCell.offsetTop, 2)
                    );

                    // set line styles
                    line.style.left = `${lineX}px`;
                    line.style.top = `${lineY}px`;
                    line.style.width = '0px';

                    // set rotation
                    if (firstCell.offsetTop === lastCell.offsetTop) {
                        line.style.transform = 'rotate(00deg)';
                    } else if (firstCell.offsetLeft === lastCell.offsetLeft) {
                        line.style.transform = 'rotate(90deg)';
                    } else {
                        const angle = Math.atan2(
                            lastCell.offsetTop - firstCell.offsetTop,
                            lastCell.offsetLeft - firstCell.offsetLeft
                        ) * 180 / Math.PI;
                        line.style.transform = `rotate(${angle}deg)`;
                    }

                    // .line
                    line.classList.add('line');

                    // append line
                    deepest.parentElement.appendChild(line);

                    setTimeout(() => {
                        line.style.width = `${lineLength}px`;
                    }, 1);

                    // unplayable
                    deepest.classList.remove('playable');
                    deepest.classList.add('done');

                    deepest.parentElement.dataset.occupied = currentPlayer;

                    // add inert to parent cell
                    const parentCell = deepest.parentElement; // .cell
                    parentCell.inert = true;

                    const game = document.querySelector('.game');

                    // check for win in parent board
                    const parentBoard = parentCell.parentElement.parentElement; // .board

                    function next(parentBoard) {
                        if (checkWin(parentBoard, currentPlayer, size)) {
                            console.log('win in parent board');

                            // add occupied to parent board
                            parentBoard.parentElement.dataset.occupied = currentPlayer;

                            // add done to all children
                            const children = parentBoard.parentElement.querySelectorAll('.board');
                            children.forEach(child => {
                                child.classList.add('done');
                            });

                            // check for win in parent board
                            // .board> .row> .cell
                            const parentCell = parentBoard.parentElement;

                            // if is body
                            if (parentCell.parentElement.parentElement.tagName === 'HTML') {
                                pujs.alert(`Player ${currentPlayer} wins the whole game!`, 'success');
                                console.log(`Player ${currentPlayer} wins the whole game!`);
                                resetZoom(game);
                                
                                document.querySelector('.controller').classList.add('setting-active');
                                
                                return true;

                                
                            }
                            // use next()
                            if (next(parentCell.parentElement.parentElement)) {
                                return true;
                            }


                            // skip to next board
                            let nextDeepest = document.querySelector('.board:not(.done)');

                            // find the deepest board which is not done
                            while (true) {
                                // If there are no more nested boards, we've reached the deepest board
                                if (!nextDeepest.querySelector('.board:not(.done)')) break;
                                nextDeepest = nextDeepest.querySelector('.board:not(.done)');
                            }

                            if (nextDeepest) {
                                nextDeepest.classList.add('playable');

                                // add game logic
                                addGameLogic(nextDeepest, nested, size);
                                console.log(nextDeepest);

                                setTimeout(() => {
                                    resetZoom(game).then(() => {
                                        setTimeout(() => {
                                            zoomToBoard(game, nextDeepest);
                                            playingBoard = nextDeepest;
                                        }, 1000);
                                    });
                                }, 1000);

                            } else {
                                pujs.alert('Game Over!');
                                // zoom out
                                resetZoom(game);
                            }

                        } else {
                            console.log('no win in parent board');
                            // check if it's a draw
                            const cells = parentBoard.querySelectorAll('&>.row>.cell');
                            let draw = true;
                            cells.forEach(cell => {
                                if (!cell.getAttribute('data-occupied')) {
                                    draw = false;
                                }
                            });

                            if (draw) {
                                console.log('draw in parent board');

                                // add to statistics

                                stastics.draw++;

                                // add done to all children
                                const children = parentBoard.querySelectorAll('.board');
                                children.forEach(child => {
                                    child.classList.add('done');
                                });

                                // check for win in parent board
                                // .board> .row> .cell
                                const parentCell = parentBoard.parentElement;

                                // if is body
                                if (parentCell.parentElement.parentElement.tagName === 'HTML') {
                                    pujs.alert('It\'s a draw!');
                                    console.log('It\'s a draw!');
                                    resetZoom(game);
                                    return true;
                                }
                                // use next()
                                if (next(parentCell.parentElement.parentElement)) {
                                    return true;
                                }

                                // skip to next board
                                let nextDeepest = document.querySelector('.board:not(.done)');
                                while (true) {
                                    // If there are no more nested boards, we've reached the deepest board
                                    if (!nextDeepest.querySelector('.board:not(.done)')) break;
                                    nextDeepest = nextDeepest.querySelector('.board:not(.done)');
                                }

                                if (nextDeepest) {
                                    nextDeepest.classList.add('playable');

                                    // add game logic
                                    addGameLogic(nextDeepest, nested, size);

                                    setTimeout(() => {
                                        resetZoom(game).then(() => {
                                            setTimeout(() => {
                                                zoomToBoard(game, nextDeepest);
                                                playingBoard = nextDeepest;
                                            }, 1000);
                                        });
                                    }, 1000);
                                } else {
                                    pujs.alert('Game Over!');
                                }
                            }
                        }

                        // find the deepest board which is not done
                        let nextDeepest = document.querySelector('.board:not(.done)');
                        while (true) {
                            // If there are no more nested boards, we've reached the deepest board
                            if (!nextDeepest.querySelector('.board:not(.done)')) break;
                            nextDeepest = nextDeepest.querySelector('.board:not(.done)');
                        }

                        if (nextDeepest) {
                            nextDeepest.classList.add('playable');

                            // add game logic
                            addGameLogic(nextDeepest, nested, size);

                            setTimeout(() => {
                                resetZoom(game).then(() => {
                                    setTimeout(() => {
                                        zoomToBoard(game, nextDeepest);
                                        playingBoard = nextDeepest;
                                    }, 1000);
                                });
                            }, 1000);
                        } else {
                            pujs.alert('Game Over!');
                        }
                    }

                    next(parentBoard);
                }

                // Switch players
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                player = currentPlayer;
            }
        });
    });
}

function checkWin(board, player, size) {
    const cells = board.querySelectorAll(':scope > .row > .cell');
    const boardSize = size;

    // Convert NodeList to a 2D array for easier checking
    const grid = [];
    for (let i = 0; i < boardSize; i++) {
        grid.push([]);
        for (let j = 0; j < boardSize; j++) {
            grid[i].push(cells[i * boardSize + j].getAttribute('data-occupied'));
        }
    }

    // Check rows
    for (let i = 0; i < boardSize; i++) {
        if (grid[i].every(cell => cell === player)) {
            return true;
        }
    }

    // Check columns
    for (let j = 0; j < boardSize; j++) {
        if (grid.every(row => row[j] === player)) {
            return true;
        }
    }

    // Check diagonals
    if (grid.every((row, index) => row[index] === player)) {
        return true;
    }
    if (grid.every((row, index) => row[boardSize - 1 - index] === player)) {
        return true;
    }

    return false;
}

function resetBoard(board) {
    moveCount = 0;
    const cells = board.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('x', 'o'); // Remove X and O classes
        cell.removeAttribute('data-occupied');
    });
}

function getGameData() {
    const game = document.querySelector('.game');
    if (!game) {
        console.error('Game container not found.');
        return null;
    }

    const topLevelBoard = game.querySelector('.board');
    if (!topLevelBoard) {
        console.error('Top-level board not found.');
        return null;
    }

    const size = parseInt(searchParams.get('size'));
    const nested = parseInt(searchParams.get('nested'));

    if (!size || !nested) {
        console.error('Size or nested level not found in URL parameters.');
        return null;
    }

    function collectBoardData(boardElement, currentDepth) {
        const rows = boardElement.querySelectorAll(':scope > .row');
        const boardData = [];

        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll(':scope > .cell');

            cells.forEach(cell => {
                const cellData = {
                    occupied: cell.getAttribute('data-occupied') || null,
                    hasBoard: false,
                    board: null
                };

                const nestedBoard = cell.querySelector('.board');
                if (nestedBoard && currentDepth < nested - 1) {
                    cellData.hasBoard = true;
                    cellData.board = collectBoardData(nestedBoard, currentDepth + 1);
                }

                rowData.push(cellData);
            });

            boardData.push(rowData);
        });

        return boardData;
    }

    const gameData = {
        size: size,
        nested: nested,
        data: collectBoardData(topLevelBoard, 0)
    };

    return gameData;
}
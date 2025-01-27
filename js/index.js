//

// Game Starter
const
    gameStarterNestedInputNumber = document.querySelector('#gameStarterNestedInputNumber'),
    gameStarterSizeInputNumber = document.querySelector('#gameStarterSizeInputNumber'),
    gameStarterSizeInputNumberAfter = document.querySelector('#gameStarterSizeInputNumberAfter'),
    gameStarterStartButton = document.querySelector('#gameStarterStartButton');
/*
 * Game
 * 1. Nested:
 *    For example, if nested is 2, players will have one more tic-tac-toe board inside each main board square.
 * 2. Size:
 *    For example, if size is 3, players will have 3x3 tic-tac-toe boards.
 */
// Always keep gameStarterSizeInputNumberAfter and gameStarterSizeInputNumber in sync
gameStarterSizeInputNumber.addEventListener('input', () => {
    // receive only one digit of number

    let value = gameStarterSizeInputNumber.value;
    // check if number, if not, remove last character
    if (isNaN(value)) {
        gameStarterSizeInputNumber.value = value.slice(0, -1);
    }

    // shift is not pressed and value is longer than 1
    if (value.length > 1) {
        // remove the first character
        gameStarterSizeInputNumber.value = value.slice(1);
    }

    gameStarterSizeInputNumberAfter.value = gameStarterSizeInputNumber.value;
});

gameStarterSizeInputNumberAfter.addEventListener('input', () => {
    // receive only one digit of number

    let value = gameStarterSizeInputNumberAfter.value;
    // check if number, if not, remove last character
    if (isNaN(value)) {
        gameStarterSizeInputNumberAfter.value = value.slice(0, -1);
    }

    // shift is not pressed and value is longer than 1

    if (value.length > 1) {
        // remove the first character
        gameStarterSizeInputNumber.value = value.slice(1);
    }

    gameStarterSizeInputNumber.value = gameStarterSizeInputNumberAfter.value;
});

gameStarterNestedInputNumber.addEventListener('input', () => {
    // receive only one digit of number

    let value = gameStarterNestedInputNumber.value;
    // check if number, if not, remove last character
    if (isNaN(value)) {
        gameStarterNestedInputNumber.value = value.slice(0, -1);
    }

    // shift is not pressed and value is longer than 1
    if (value.length > 1) {
        // remove the first character
        gameStarterNestedInputNumber.value = value.slice(1);
    }
});

gameStarterStartButton.addEventListener('click', () => {
    const nested = gameStarterNestedInputNumber.value,
        size = gameStarterSizeInputNumber.value;

    if (nested > 4) {
        pujs.popup('It\'s too much!',
            `Your browser may not be able to handle ${nested} nested boards.`,
            [{
                text: 'Continue Anyway',
                callback: function () {
                    window.location.href = `./app/?nested=${nested}&size=${size}`;
                },
                color: 'var(--pu-red)'
            },
            {
                text: 'Cancel'
            }],
            'vert',
        );
    } else if (nested && size) {
        window.location.href = `/app/?nested=${nested}&size=${size}`;
    }
});
// Game Starter
const gameStarterNestedInputNumber = document.querySelector('#gameStarterNestedInputNumber');
const gameStarterSizeInputNumber = document.querySelector('#gameStarterSizeInputNumber');
const gameStarterSizeInputNumberAfter = document.querySelector('#gameStarterSizeInputNumberAfter');
const gameStarterStartButton = document.querySelector('#gameStarterStartButton');

/**
 * Validate and sync input values.
 * Ensures only single-digit numbers are allowed and syncs the two size inputs.
 * @param {HTMLInputElement} input - The input element to validate.
 * @param {HTMLInputElement} syncInput - The input element to sync with.
 */
const validateAndSyncInput = (input, syncInput) => {
    let value = input.value;

    // Remove non-numeric characters
    if (isNaN(value)) {
        input.value = value.slice(0, -1);
        return;
    }

    // Ensure only one digit is entered
    if (value.length > 1) {
        input.value = value.slice(-1); // Keep only the last character
    }

    // Sync the other input
    syncInput.value = input.value;
};

/**
 * Handle nested input validation.
 * Ensures only single-digit numbers are allowed.
 * @param {HTMLInputElement} input - The input element to validate.
 */
const validateNestedInput = (input) => {
    let value = input.value;

    // Remove non-numeric characters
    if (isNaN(value)) {
        input.value = value.slice(0, -1);
        return;
    }

    // Ensure only one digit is entered
    if (value.length > 1) {
        input.value = value.slice(-1); // Keep only the last character
    }
};

/**
 * Start the game with the selected parameters.
 * Displays a warning if the nested value is too high.
 */
const startGame = () => {
    const nested = gameStarterNestedInputNumber.value;
    const size = gameStarterSizeInputNumber.value;

    if (!nested || !size) {
        return; // Exit if inputs are empty
    }

    if ((size * size) ** nested > 6000) {
        pujs.popup(
            'It\'s too much!',
            `Your browser may not be able to handle ${size*size}^${nested} nested boards.`,
            [
                {
                    text: 'Continue Anyway',
                    callback: () => {
                        window.location.href = `./app/?nested=${nested}&size=${size}`;
                    },
                    color: 'var(--pu-red)'
                },
                {
                    text: 'Cancel'
                }
            ],
            'vert'
        );
    } else {
        window.location.href = `./app/?nested=${nested}&size=${size}`;
    }
};

// Event Listeners
gameStarterSizeInputNumber.addEventListener('input', () => {
    validateAndSyncInput(gameStarterSizeInputNumber, gameStarterSizeInputNumberAfter);
});

gameStarterSizeInputNumberAfter.addEventListener('input', () => {
    validateAndSyncInput(gameStarterSizeInputNumberAfter, gameStarterSizeInputNumber);
});

gameStarterNestedInputNumber.addEventListener('input', () => {
    validateNestedInput(gameStarterNestedInputNumber);
});

gameStarterStartButton.addEventListener('click', startGame);
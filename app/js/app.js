const controller = document.querySelector('.controller');

// Handle controller position during alerts
pujs.setup.todo.alert.start = () => {
    controller.style.bottom = '1rem';
};

pujs.setup.todo.alert.end = () => {
    controller.style.bottom = '2rem';
};

// Zoom toggle functionality
document.querySelector('#zoom-in-out-toggle').addEventListener('change', function () {
    const zoomAnimated = document.querySelector('.zoom-in-out-animted');
    zoomAnimated.classList.toggle('zoom-in');

    if (zoomed) {
        resetZoom(document.querySelector('.game'), false);
        zoomed = false;
    } else {
        zoomToBoard(document.querySelector('.game'), playingBoard, false);
        zoomed = true;
    }
});

// Toggle extra settings menu
document.querySelector('.extra-settings-toggle').addEventListener('click', function () {
    controller.classList.toggle('setting-active');
});

// Display current player info
document.querySelector('.current-player').addEventListener('click', function () {
    pujs.alert(`Next player is ${player}`, 'null', 1000);
});

// Restart game confirmation
document.querySelector('.action-setting-restart').addEventListener('click', function () {
    pujs.popup(
        'Restart Game',
        'All progress will be lost if you restart the game.',
        [
            {
                text: 'Restart',
                callback: () => location.reload(),
                color: 'var(--pu-red)'
            },
            {
                text: 'Cancel'
            }
        ],
        'horiz',
        null,
        { lockscreen: false }
    );
});

// Exit game confirmation
document.querySelector('.action-setting-exit').addEventListener('click', function () {
    pujs.popup(
        'Exit Game',
        'All progress will be lost if you exit the game.',
        [
            {
                text: 'Exit',
                callback: () => (window.location.href = '../'),
                color: 'var(--pu-red)'
            },
            {
                text: 'Cancel'
            }
        ],
        'horiz',
        null,
        { lockscreen: false }
    );
});

// Reset board confirmation
document.querySelector('.action-setting-reset-board').addEventListener('click', function () {
    pujs.popup(
        'Reset Board',
        'All progress will be lost if you reset the board.',
        [
            {
                text: 'Reset',
                callback: () => {
                    resetBoard(playingBoard);
                    document.querySelector('.extra-settings-toggle').click();
                },
                color: 'var(--pu-red)'
            },
            {
                text: 'Cancel'
            }
        ],
        'horiz',
        null,
        { lockscreen: false }
    );
});

// Other settings menu
document.querySelector('.action-setting-other').addEventListener('click', function () {
    pujs.actionSheet(
        'Other Settings',
        'More things to configure.',
        [
            {
                text: 'Statistics',
                callback: () => {
                    document.querySelector('.extra-settings-toggle').click();
                    pujs.pullOut(
                        `<h2>Statistics</h2>
                        <p>Wins: ${stastics.win.X} (X) | ${stastics.win.O} (O)</p>
                        <p>Draws: ${stastics.draw}</p>
                        <p>Moves:</p>
                        <p>X: ${stastics.moves.X.length}</p>
                        <p>O: ${stastics.moves.O.length}</p>`,
                        false,
                        {
                            id: 'pullOut',
                            lockscreen: false,
                            height: 'calc(90% - 3rem)',
                            closeButton: true,
                            dragHandle: true
                        }
                    );
                }
            },
            {
                text: 'Share',
                callback: () => {
                    document.querySelector('.extra-settings-toggle').click();
                    if (navigator.share) {
                        navigator.share({
                            title: 'REAL-UNLIMITED Tic Tac Toe',
                            text: 'Play Tic Tac Toe with your friends.',
                            url: window.location.href
                        })
                            .then(() => console.log('Successful share'))
                            .catch((error) => console.log('Error sharing', error));
                    } else {
                        pujs.alert('Share API not supported.');
                    }
                }
            }
        ],
        { lockscreen: false }
    );
});
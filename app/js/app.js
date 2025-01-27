const controller = document.querySelector('.controller');

pujs.setup.todo.alert.start = () => {
    controller.style.bottom = '1rem';
}

pujs.setup.todo.alert.end = () => {
    controller.style.bottom = '2rem';
}

document.querySelector('#zoom-in-out-toggle').addEventListener('change', function () {
    document.querySelector('.zoom-in-out-animted').classList.toggle('zoom-in');

    if (zoomed) {
        resetZoom(document.querySelector('.game'), false);
        zoomed = false;
    } else {
        zoomToBoard(document.querySelector('.game'), playingBoard, false);
        zoomed = true;
    }
});

document.querySelector('.extra-settings-toggle').addEventListener('click', function () {
    document.querySelector('.controller').classList.toggle('setting-active');
});


document.querySelector('.current-player').addEventListener('click', function () {
    pujs.alert('Next player is ' + player, 'null', 1000);
});

document.querySelector('.action-setting-restart').addEventListener('click', function () {
    pujs.popup('Restart Game', // Title
        'All progress will be lost if you restart the game.',
        [ // Buttons
            {
                text: 'Restart',
                callback: function () {
                    location.reload();
                },
                color: 'var(--pu-red)'
            },
            {
                text: 'Cancel'
            }
        ],
        'horiz',
        null, // input
        {
            lockscreen: false
        } // options
    );
});

document.querySelector('.action-setting-exit').addEventListener('click', function () {
    pujs.popup('Exit Game', // Title
        'All progress will be lost if.',
        [ // Buttons
            {
                text: 'Exit',
                callback: function () {
                    window.location.href = '../';
                },
                color: 'var(--pu-red)'
            },
            {
                text: 'Cancel'
            }
        ],
        'horiz',
        null, // input
        {
            lockscreen: false
        } // options
    );
});

document.querySelector('.action-setting-reset-board').addEventListener('click', function () {
    pujs.popup('Reset Board', // Title
        'All progress will be lost if you reset the board.',
        [ // Buttons
            {
                text: 'Reset',
                callback: function () {
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
        null, // input
        {
            lockscreen: false
        } // options
    );
});

document.querySelector('.action-setting-other').addEventListener('click', function () {
    pujs.actionSheet('Other Settings', // Title
        'More things to configure.', // Description
        // const stastics = {
        //     moves: {
        //         X: [],
        //         O: []
        //     },
        //     win: {
        //         X: 0,
        //         O: 0
        //     },
        //     draw: 0
        // };

        [
            {
                'text': 'Statistics',
                'callback': function () {
                    document.querySelector('.extra-settings-toggle').click();
                    pujs.pullOut(
                        `<h2>Statistics</h2>
                        <p>Wins: ${stastics.win.X} (X) | ${stastics.win.O} (O)</p>
                        <p>Draws: ${stastics.draw}</p>
                        <p>Moves:</p>
                        <p>X: ${stastics.moves.X.length}</p>
                        <p>O: ${stastics.moves.O.length}</p>
                        `, false, {
                        id: 'pullOut',
                        lockscreen: false, // Prevent interaction with the rest of the page. Can be set to false when your app already has a locked screen.
                        height: 'calc(90% - 3rem)', // The height of the pull-out. 
                        closeButton: true, // Show a close button in the pull-out.
                        dragHandle: true, // Show a drag handle in the pull-out. (No actual use)
                    });
                }
            },
            {
                'text': 'Share',
                'callback': function () {
                    document.querySelector('.extra-settings-toggle').click();
                    // share API
                    if (navigator.share) {
                        navigator.share({
                            title: 'REAL-UNLIMITED Tic Tac Toe',
                            text: 'Play Tic Tac Toe with your friends.',
                            url: window.location.href
                        })
                            .then(() => console.log('Successful share'))
                            .catch((error) => console.log('Error sharing', error));
                    } else {
                        pujs.alert('Share API not supported.', 'null', 1000);
                    }
                }
            }
        ],
        {
            lockscreen: false
        }
    );
});
'use strict';

const Server = require('./server');


const cmds = {
    off(duration) {
        return {
            mode: 'fade',
            data: {
                color1: {r: 0, g: 0, b: 0},
                duration: (duration || .25) * 1000
            }
        };
    },

    hex(hex, duration) {
        if (!/^[\da-f]{6}$/i.test(hex)) {
            return;
        }

        return {
            mode: 'fade',
            data: {
                color1: {
                    r: parseInt(hex.slice(0, 2), 16),
                    g: parseInt(hex.slice(2, 4), 16),
                    b: parseInt(hex.slice(4, 6), 16)
                },
                duration: (duration || 1) * 1000
            }
        };
    },

    rainbow(duration) {
        return {
            mode: 'rainbow',
            data: {
                duration: (duration || 5) * 1000,
                length: 500
            }
        };
    }
};

if (process.argv.length > 2) {
    const cmd = (process.argv[2] || '').toLowerCase();

    if (!(cmd in cmds)) {
        console.log('Unknown command.');
        process.exit();
    }

    const params = cmds[cmd].apply(null, process.argv.slice(3));
    if (!params) {
        console.log('Invalid parameters.');
        process.exit();
    }

    const server = new Server();
    server.serial.on('open', () => {
        server.send(params.mode, params.data, (err) => {
            if (err) {
                console.log('Error:', err.message);
            }
            process.exit();
        });
    });
}

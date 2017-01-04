'use strict';

const SerialPort = require('serialport');

const config = require('./config.json');
const modes = require('./modes');


const Server = function () {
    this.serial = new SerialPort(config.port, {
        baudrate: 9600,
        dtr: false
    });

    this.serial
        .on('open', () => {
            console.log('Connected to serial port', this.serial.path);
        })
        .on('error', (err) => {
            console.error('Error connecting to serial port:', err.message);
        });
};

Server.prototype.send = function (mode, data, callback) {
    if (!(mode in modes)) {
        return callback(new Error('Unrecognized mode.'));
    }

    const bytes = [Object.keys(modes).indexOf(mode)].concat(modes[mode](data));

    this.serial.write(new Buffer(bytes), (err) => {
        if (err) {
            return callback(err);
        }

        console.log(`Wrote ${bytes.length} bytes:`, bytes.join(' '));
        callback();
    });
}

module.exports = Server;

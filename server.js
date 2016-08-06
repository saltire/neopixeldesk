'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const SerialPort = require('serialport');

const modes = require('./modes');


const serial = new SerialPort('COM4', {
    baudrate: 9600,
    dtr: false
});


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use('/', express.static(path.join(__dirname, 'dist')));

app.post('/color', (req, res, next) => {
    const mode = ['Fade', 'Wipe', 'Marquee', 'Rainbow', 'Pulse'].indexOf(req.body.mode);
    if (mode === -1) {
        return res.status(400);
    }

    if (!(req.body.mode in modes)) {
        res.jsonp({
            success: false,
            message: 'Unrecognized mode.'
        });
    }

    const data = JSON.parse(req.body.data);
    const bytes = [mode].concat(modes[req.body.mode](data));

    serial.write(new Buffer(bytes), (err, count) => {
        if (err) {
            return res.jsonp({
                success: false,
                message: err.message
            });
        }

        console.log('Wrote', count, 'bytes:', bytes.join(' '));
        res.jsonp({
            success: true,
            message: 'Successfully sent data.'
        });
    });
});


serial.on('open', () => {
    console.log('Connected to serial port', serial.path);

    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log('Listening on HTTP port', port);
});

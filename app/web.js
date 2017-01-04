'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const Server = require('./server');


const server = new Server();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use('/', express.static(path.join(__dirname, '../dist')));

app.post('/color', (req, res, next) => {
    const mode = (req.body.mode || '').toLowerCase();
    const data = JSON.parse(req.body.data);

    server.send(mode, data, (err) => {
        if (err) {
            return res.jsonp({
                success: false,
                message: err.message
            });
        }

        res.jsonp({
            success: true,
            message: 'Successfully sent data.'
        });
    });
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on HTTP port', port);

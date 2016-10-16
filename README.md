# neopixeldesk

Controller for a NeoPixel LED strip via Arduino. Requires NodeJS.

### Install

`npm install` to install packages.

`gulp build` to set up web panel
(if you've installed gulp globally; otherwise `$(npm bin)/gulp build`).

### Run

`npm start` to launch web panel; access at `http://localhost:5000`.

`npm run cmd [cmd]` to run quick commands from shell. Commands include:

- `hex [colour] [duration]` to fade to a colour (in hex format, no # sign).
    Default colour is FFFFFF (white), default duration is 1 second.
- `rainbow [duration] [length]` for rainbow mode.
    Default duration is 5 seconds, default length is 500 pixels.
- `off [duration]` to turn off.
    Default duration is 0.25 seconds.

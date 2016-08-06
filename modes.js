module.exports = {
    Fade: (data) => [
        data.color1.r,
        data.color1.g,
        data.color1.b,
        data.duration >> 8,
        data.duration & 0xff
    ],

    Wipe: (data) => [
        data.color1.r,
        data.color1.g,
        data.color1.b,
        data.duration >> 8,
        data.duration & 0xff
    ],

    Marquee: (data) => [
        data.color1.r,
        data.color1.g,
        data.color1.b,
        data.color2.r,
        data.color2.g,
        data.color2.b,
        data.length1 >> 8,
        data.length1 & 0xff,
        data.length2 >> 8,
        data.length2 & 0xff,
        data.duration >> 8,
        data.duration & 0xff
    ],

    Rainbow: (data) => [
        data.duration >> 8,
        data.duration & 0xff,
        data.length >> 8,
        data.length & 0xff
    ],

    Pulse: (data) => [
        data.color1.r,
        data.color1.g,
        data.color1.b,
        data.color2.r,
        data.color2.g,
        data.color2.b,
        data.duration >> 8,
        data.duration & 0xff
    ]
};

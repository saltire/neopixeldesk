#include <Adafruit_NeoPixel.h>
#include <avr/power.h>

#define PIN 6
#define NUM_PIXELS 150

// modes
#define MODE_IDLE 0
#define MODE_WIPE 1
#define MODE_FADE 2
#define MODE_MARQUEE 3
#define MODE_RAINBOW 4

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
    strip.begin();
    strip.show(); // Initialize all pixels to 'off'

    uint8_t color[3] = {255, 0, 0};
    colorFade(color, 1000, 20);

    Serial.begin(9600);
}

void loop() {
    if (Serial.available()) {
        // uint8_t mode = Serial.read();
        uint8_t mode = MODE_FADE;
        uint8_t color1[3];

        if (mode == MODE_WIPE) {
            readColor(color1);
            colorWipe(color1, 1000);
        }
        else if (mode == MODE_FADE) {
            readColor(color1);
            colorFade(color1, 1000, 20);
        }
        else if (mode == MODE_MARQUEE) {
            readColor(color1);
            colorMarquee(color1, 5, 2, 20, true);
        }
    }
}

void readColor(uint8_t *color) {
    while (Serial.available() < 3) {}
    color[0] = Serial.read();
    color[1] = Serial.read();
    color[2] = Serial.read();
}

// Fill all the dots with a color simultaneously
void setColor(uint8_t *color) {
    uint8_t r = color[0];
    uint8_t g = color[1];
    uint8_t b = color[2];

    for (uint16_t p = 0; p < NUM_PIXELS; p++) {
        strip.setPixelColor(p, r, g, b);
    }
    strip.show();
}

// Fill the dots one after the other with a color
void colorWipe(uint8_t *color, uint16_t duration) {
    uint8_t r = color[0];
    uint8_t g = color[1];
    uint8_t b = color[2];
    uint16_t stepDuration = duration / NUM_PIXELS;

    for (uint16_t p = 0; p < NUM_PIXELS; p++) {
        strip.setPixelColor(p, r, g, b);
        strip.show();
        delay(stepDuration);
        if (Serial.available()) return;
    }
}

// Fade all pixels smoothly from their current color to a target color
void colorFade(uint8_t *color, uint16_t duration, uint16_t stepDuration) {
    if (duration == 0) {
        setColor(color1);
        return;
    }
    if (stepDuration > duration) stepDuration = duration;

    uint8_t r = color[0];
    uint8_t g = color[1];
    uint8_t b = color[2];
    uint8_t *pixels = strip.getPixels();

    for (uint16_t s = duration / stepDuration; s > 0; s--) {
        for (uint16_t p = 0; p < NUM_PIXELS; p++) {
            uint8_t *pixel = &pixels[p * 3];
            uint8_t pr = pixel[1];
            uint8_t pg = pixel[0];
            uint8_t pb = pixel[2];

            uint8_t sr = (r > pr) ? (pr + (r - pr) / s) : (pr - (pr - r) / s);
            uint8_t sg = (g > pg) ? (pg + (g - pg) / s) : (pg - (pg - g) / s);
            uint8_t sb = (b > pb) ? (pb + (b - pb) / s) : (pb - (pb - b) / s);

            strip.setPixelColor(p, sr, sg, sb);
        }
        strip.show();
        delay(stepDuration);
        if (Serial.available()) return;
    }
}

// Create a scrolling marquee of groups of alternating on and off pixels of a single color
void colorMarquee(uint8_t *color, uint16_t lightLength, uint16_t darkLength,
        uint16_t stepDuration, bool clockwise) {
    uint8_t r = color[0];
    uint8_t g = color[1];
    uint8_t b = color[2];
    uint16_t length = lightLength + darkLength;

    while (1) {
        for (uint16_t s = 0; s < length; s++) {
            uint16_t offset = clockwise ? s : (length - s - 1);
            for (uint16_t p = 0; p < NUM_PIXELS; p++) {
                if ((p + offset) % length < lightLength) {
                    strip.setPixelColor(p, r, g, b);
                }
                else {
                    strip.setPixelColor(p, 0, 0, 0);
                }
            }
            strip.show();
            delay(stepDuration);
            if (Serial.available()) return;
        }
    }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
    WheelPos = 255 - WheelPos;
    if (WheelPos < 85) {
        return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
    }
    else if (WheelPos < 170) {
        WheelPos -= 85;
        return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
    }
    else {
        WheelPos -= 170;
        return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
    }
}

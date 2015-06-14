#include <Adafruit_NeoPixel.h>
#include <avr/power.h>

#define PIN 6
#define NUM_PIXELS 150

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
    //setColor(0, 255, 0);
    colorFade(255, 0, 0, 1000, 20);
    //colorMarquee(255, 0, 0, 3, 7, 20, false);
    Serial.begin(9600);
}

void loop() {
    if (Serial.available() >= 3) {
        uint8_t r = Serial.read();
        uint8_t g = Serial.read();
        uint8_t b = Serial.read();
        colorFade(r, g, b, 1000, 20);
    }
}

// Fill all the dots with a color simultaneously
void setColor(uint8_t r, uint8_t g, uint8_t b) {
    for (uint16_t i = 0; i < strip.numPixels(); i++) {
        strip.setPixelColor(i, r, g, b);
    }
    strip.show();
}

// Fill the dots one after the other with a color
void colorWipe(uint8_t r, uint8_t g, uint8_t b, uint16_t step) {
    for (uint16_t p = 0; p < strip.numPixels(); p++) {
        strip.setPixelColor(p, r, g, b);
        strip.show();
        delay(step);
    }
}

void colorFade(uint8_t r, uint8_t g, uint8_t b, uint16_t duration, uint16_t step) {
    if (duration == 0) {
        setColor(r, g, b);
        return;
    }
    if (step > duration) step = duration;

    uint8_t *pixels = strip.getPixels();
    for (uint16_t s = duration / step; s > 0; s--) {
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
        delay(step);
    }
}

void colorMarquee(uint8_t r, uint8_t g, uint8_t b, uint16_t light, uint16_t dark, uint16_t step, bool clockwise) {
    uint16_t length = light + dark;
    while (1) {
        for (uint16_t s = 0; s < length; s++) {
            uint16_t offset = clockwise ? s : (length - s - 1);
            for (uint16_t p = 0; p < NUM_PIXELS; p++) {
                if ((p + offset) % length < light) {
                    strip.setPixelColor(p, r, g, b);
                }
                else {
                    strip.setPixelColor(p, 0, 0, 0);
                }
            }
            strip.show();
            delay(step);
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

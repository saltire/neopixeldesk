import time

from serial import Serial


class NeoPixel:
    def __init__(self, port='COM7', baud=9600):
        self.serial = Serial()
        self.serial.setDTR(False)  # Avoid resetting Arduino on serial connection
        self.serial.port = port
        self.serial.baudrate = baud
        self.serial.open()
        time.sleep(2)

    def write(self, *ints):
        self.serial.write(bytes(ints))
        print('Sent bytes:', ' '.join([hex(i)[2:].zfill(2) for i in ints]))

    def set_rgb(self, r, g, b):
        self.write(r, g, b)


if __name__ == '__main__':
    neopixel = NeoPixel()
    neopixel.set_rgb(128, 0, 0)

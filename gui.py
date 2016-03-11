import json

from flask import Flask, jsonify, redirect, render_template, request, url_for

from neopixel import NeoPixel


neo = NeoPixel()

app = Flask(__name__)
app.secret_key = b'h\xff\xb2k\xb3\xbf\x81\xe8\xf1%\xce\x8f\x8c\x8fg\xf9\x8f\xbf"\x9aI\xb4\xc1\xb0'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/color', methods=['POST'])
def set_color():
    mode = ['Fade', 'Wipe', 'Marquee', 'Rainbow', 'Pulse'].index(request.form['mode'])
    data = json.loads(request.form['data'])

    if request.form['mode'] in ['Fade', 'Wipe']:
        neo.write(mode,
                  data['color1']['r'],
                  data['color1']['g'],
                  data['color1']['b'],
                  data['duration'] >> 8,
                  data['duration'] & 0xff)

    if request.form['mode'] == 'Marquee':
        neo.write(mode,
                  data['color1']['r'],
                  data['color1']['g'],
                  data['color1']['b'],
                  data['color2']['r'],
                  data['color2']['g'],
                  data['color2']['b'],
                  data['length1'] >> 8,
                  data['length1'] & 0xff,
                  data['length2'] >> 8,
                  data['length2'] & 0xff,
                  data['duration'] >> 8,
                  data['duration'] & 0xff)

    elif request.form['mode'] == 'Rainbow':
        neo.write(mode,
                  data['duration'] >> 8,
                  data['duration'] & 0xff,
                  data['length'] >> 8,
                  data['length'] & 0xff)

    elif request.form['mode'] == 'Pulse':
        neo.write(mode,
                  data['color1']['r'],
                  data['color1']['g'],
                  data['color1']['b'],
                  data['color2']['r'],
                  data['color2']['g'],
                  data['color2']['b'],
                  data['duration'] >> 8,
                  data['duration'] & 0xff)

    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run()

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
    mode = ['Fade', 'Wipe', 'Marquee', 'Rainbow'].index(request.form['mode'])
    data = json.loads(request.form['data'])

    print(mode, data)

    if request.form['mode'] in ['Fade', 'Wipe', 'Marquee']:
        neo.write(mode, data['color1']['r'], data['color1']['g'], data['color1']['b'])

    elif request.form['mode'] == 'Rainbow':
        neo.write(mode)

    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run()

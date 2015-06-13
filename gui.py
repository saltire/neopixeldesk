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
    r, g, b = (int(val) for val in (request.form['r'], request.form['g'], request.form['b']))
    neo.set_rgb(r, g, b)
    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run()

function hexColor(color) {
    const num = color.r * 0x10000 + color.g * 0x100 + color.b;
    const str = num.toString(16);
    return '#' + '000000'.slice(str.length) + str;
}


const Color = function (r, g, b) {
    this.r = Number(r) || 0;
    this.g = Number(g) || 0;
    this.b = Number(b) || 0;
};


const ColorSelect = React.createClass({
    channels: [
        {id: 'r', label: 'Red'},
        {id: 'g', label: 'Green'},
        {id: 'b', label: 'Blue'}
    ],

    updateColor() {
        this.props.updateValue(this.props.mode, this.props.name, new Color(
            parseInt(ReactDOM.findDOMNode(this.refs.r).value),
            parseInt(ReactDOM.findDOMNode(this.refs.g).value),
            parseInt(ReactDOM.findDOMNode(this.refs.b).value)
        ));
    },

    render() {
        return (
            <div>
                <h3>{this.props.label}</h3>
                {this.channels.map((channel) => {
                    const name = this.props.mode + '-' + this.props.name + '-' + channel.id;
                    return (
                        <div key={name} className='row'>
                            <div className='col-sm-2 col-xs-6'><label htmlFor={name}>{channel.label}</label></div>
                            <div className='col-sm-1 col-xs-6'>{this.props.color[channel.id]}</div>
                            <div className='col-sm-9 col-xs-12'>
                                <input type='range' min='0' max='255' id={name} value={this.props.color[channel.id]} ref={channel.id} onChange={this.updateColor} />
                            </div>
                        </div>
                    );
                })}
                <div style={{background: hexColor(this.props.color)}}>&nbsp;</div>
            </div>
        );
    }
});


const NumberRange = React.createClass({
    updateRange() {
        this.props.updateValue(this.props.mode, this.props.name,
            parseInt(ReactDOM.findDOMNode(this.refs.range).value));
    },

    render() {
        const name = this.props.mode + '-' + this.props.name;
        return (
            <div className='row'>
                <div className='col-sm-2 col-xs-6'><label htmlFor={name}>{this.props.label}</label></div>
                <div className='col-sm-1 col-xs-6'>{this.props.value}</div>
                <div className='col-sm-9 col-xs-12'>
                    <input type='range' min={this.props.min} max={this.props.max} id={name} value={this.props.value} ref='range' onChange={this.updateRange} />
                </div>
            </div>
        );
    }
});


const ColorForm = React.createClass({
    getInitialState() {
        return {
            currentMode: 'Fade',
            modeData: {
                Fade: {
                    color1: new Color(),
                    duration: 1000
                },
                Wipe: {
                    color1: new Color(),
                    duration: 1000,
                    reverse: false
                },
                Marquee: {
                    color1: new Color(),
                    color2: new Color(),
                    length1: 5,
                    length2: 2,
                    duration: 1000,
                    reverse: false
                },
                Rainbow: {
                    duration: 5000,
                    length: 500,
                    reverse: false
                },
                Pulse: {
                    color1: new Color(),
                    color2: new Color(),
                    duration: 1000
                }
            }
        };
    },

    getModeElement(mode) {
        const modeData = this.state.modeData[mode];

        if (mode === 'Fade') {
            return (
                <div>
                    <ColorSelect mode='Fade' name='color1' label='Color' updateValue={this.updateValue} color={modeData.color1} />
                    <NumberRange mode='Fade' name='duration' label='Duration (msec)' updateValue={this.updateValue} min='100' max='10000' value={modeData.duration} />
                </div>
            );
        }
        else if (mode === 'Wipe') {
            return (
                <div>
                    <ColorSelect mode='Wipe' name='color1' label='Color' updateValue={this.updateValue} color={modeData.color1} />
                    <NumberRange mode='Wipe' name='duration' label='Duration (msec)' updateValue={this.updateValue} min='100' max='10000' value={modeData.duration} />
                </div>
            );
        }
        else if (mode === 'Marquee') {
            return (
                <div>
                    <ColorSelect mode='Marquee' name='color1' label='Primary Color' updateValue={this.updateValue} color={modeData.color1} />
                    <NumberRange mode='Marquee' name='length1' label='Primary Color Length' updateValue={this.updateValue} min='1' max='150' value={modeData.length1} />
                    <ColorSelect mode='Marquee' name='color2' label='Secondary Color' updateValue={this.updateValue} color={modeData.color2} />
                    <NumberRange mode='Marquee' name='length2' label='Secondary Color Length' updateValue={this.updateValue} min='1' max='150' value={modeData.length2} />
                    <NumberRange mode='Marquee' name='duration' label='Duration (msec)' updateValue={this.updateValue} min='100' max='10000' value={modeData.duration} />
                </div>
            );
        }
        else if (mode === 'Rainbow') {
            return (
                <div>
                    <NumberRange mode='Rainbow' name='duration' label='Duration (msec)' updateValue={this.updateValue} min='100' max='10000' value={modeData.duration} />
                    <NumberRange mode='Rainbow' name='length' label='Length (pixels)' updateValue={this.updateValue} min='1' max='600' value={modeData.length} />
                </div>
            );
        }
        else if (mode === 'Pulse') {
            return (
                <div>
                    <ColorSelect mode='Pulse' name='color1' label='Primary Color' updateValue={this.updateValue} color={modeData.color1} />
                    <ColorSelect mode='Pulse' name='color2' label='Secondary Color' updateValue={this.updateValue} color={modeData.color2} />
                    <NumberRange mode='Pulse' name='duration' label='Duration (msec)' updateValue={this.updateValue} min='100' max='10000' value={modeData.duration} />
                </div>
            );
        }
    },

    updateValue(mode, prop, value) {
        this.setState((state) => {
            state.modeData[mode][prop] = value;
        });
    },

    updateMode(e) {
        const mode = e.currentTarget.getElementsByTagName('input')[0].value;
        this.setState((state) => {
            state.currentMode = mode;
            return state;
        });
    },

    send(e) {
        e.preventDefault();

        $.ajax({
            method: 'post',
            url: this.props.action,
            data: {
                mode: this.state.currentMode,
                data: JSON.stringify(this.state.modeData[this.state.currentMode])
            }
        });
    },

    render() {
        return (
            <form ref='form' onSubmit={this.send}>
                <div className='btn-group' data-toggle='buttons'>
                    {Object.keys(this.state.modeData).map((mode, i) => (
                        <label key={mode} className={`btn btn-default${this.state.currentMode == mode ? ' active' : ''}`} onClick={this.updateMode}>
                            {mode} <input type='radio' name='mode' value={mode} />
                        </label>
                    ))}
                </div>

                {this.getModeElement(this.state.currentMode)}

                <button className='btn'>Send</button>
            </form>
        );
    }
});


$(() => ReactDOM.render(<ColorForm action='/color' />, document.getElementById('form')));

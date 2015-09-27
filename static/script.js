function hexColor(color) {
    var num = color.r * 0x10000 + color.g * 0x100 + color.b;
    var str = num.toString(16);
    return '#' + '000000'.slice(str.length) + str;
}


var Color = function (r, g, b) {
    this.r = Number(r) || 0;
    this.g = Number(g) || 0;
    this.b = Number(b) || 0;
};


var ColorSelect = React.createClass({
    channels: [
        {id: 'r', label: 'Red'},
        {id: 'g', label: 'Green'},
        {id: 'b', label: 'Blue'}
    ],

    updateColor: function () {
        var newColor = new Color(
            parseInt(this.refs.r.getDOMNode().value),
            parseInt(this.refs.g.getDOMNode().value),
            parseInt(this.refs.b.getDOMNode().value)
        );
        this.props.updateValue(this.props.mode, this.props.name, newColor);
    },

    render: function () {
        var _ = this;
        return (
            <div>
                {this.channels.map(function (channel) {
                    var name = _.props.name + '-' + channel.id;
                    return (
                        <div key={name} className='row'>
                            <div className='col-sm-1 col-xs-6'><label htmlFor={name}>{channel.label}</label></div>
                            <div className='col-sm-1 col-xs-6'>{_.props.color[channel.id]}</div>
                            <div className='col-sm-10 col-xs-12'>
                                <input type='range' min='0' max='255' id={name} value={_.props.color[channel.id]} ref={channel.id} onChange={_.updateColor} />
                            </div>
                        </div>
                    );
                })}
                <div style={{background: hexColor(this.props.color)}}>&nbsp;</div>
            </div>
        );
    }
});


var ColorForm = React.createClass({
    getInitialState: function () {
        return {
            currentMode: 'Fade',
            modeData: {
                Fade: {
                    color1: new Color(),
                    period: 1000
                },
                Wipe: {
                    color1: new Color(),
                    period: 1000,
                    reverse: false
                },
                Marquee: {
                    color1: new Color(),
                    color2: new Color(),
                    period: 1000,
                    reverse: false
                },
                Rainbow: {
                    period: 1000,
                    reverse: false
                }
            }
        };
    },

    getModeElement: function (mode) {
        var modeData = this.state.modeData[mode];

        if (mode === 'Fade') {
            return (
                <div>
                    <ColorSelect mode='Fade' name='color1' updateValue={this.updateValue} color={modeData.color1} />
                    <p>Period: {modeData.period}</p>
                </div>
            );
        }
        else if (mode === 'Wipe') {
            return (
                <div>
                    <ColorSelect mode='Wipe' name='color1' updateValue={this.updateValue} color={modeData.color1} />
                </div>
            );
        }
        else if (mode === 'Marquee') {
            return (
                <div>
                    <ColorSelect mode='Marquee' name='color1' updateValue={this.updateValue} color={modeData.color1} />
                    <ColorSelect mode='Marquee' name='color2' updateValue={this.updateValue} color={modeData.color2} />
                </div>
            );
        }
        else if (mode === 'Rainbow') {
            return (
                <div>
                </div>
            );
        }
    },

    updateValue: function (mode, prop, value) {
        this.setState(function (state) {
            state.modeData[mode][prop] = value;
        });
    },

    updateMode: function (e) {
        var mode = e.currentTarget.getElementsByTagName('input')[0].value;
        this.setState(function (state) {
            state.currentMode = mode;
            return state;
        });
    },

    send: function (e) {
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

    render: function () {
        var _ = this;

        return (
            <form ref='form' onSubmit={this.send}>
                <div className='btn-group' data-toggle='buttons'>
                    {Object.keys(this.state.modeData).map(function (mode, i) {
                        return (
                            <label key={mode} className={'btn btn-default' + (_.state.currentMode == mode ? ' active' : '')} onClick={_.updateMode}>
                                {mode} <input type='radio' name='mode' value={mode} />
                            </label>
                        );
                    })}
                </div>

                {this.getModeElement(this.state.currentMode)}

                <button className='btn'>Send</button>
            </form>
        );
    }
});


React.render(<ColorForm action='/color' />, document.getElementById('form'));

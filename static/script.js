function hexColor(color) {
    var num = color.r * 65536 + color.g * 256 + color.b;
    var str = num.toString(16);
    return '#' + '000000'.slice(str.length) + str;
}


var Slider = React.createClass({
    updateColor: function () {
        this.props.updateColor(this.props.id, this.refs.colorValue.getDOMNode().value);
    },

    render: function () {
        return (
            <div className='row'>
                <div className='col-sm-1 col-xs-6'>{this.props.label}</div>
                <div className='col-sm-1 col-xs-6'>{this.props.value}</div>
                <div className='col-sm-10 col-xs-12'>
                    <input type='range' min='0' max='255' name={this.props.id} value={this.props.value} ref='colorValue' onChange={this.updateColor} />
                </div>
            </div>
        );
    }
});


var ColorForm = React.createClass({
    getInitialState: function () {
        return {
            colorValues: {
                r: 0,
                g: 0,
                b: 0
            }
        };
    },

    updateColor: function (id, value) {
        this.setState(function (state) {
            state.colorValues[id] = parseInt(value);
            return state;
        });
    },

    send: function (e) {
        e.preventDefault();
        var form = e.target;
        $.post(this.props.action, {
            mode: parseInt(form.elements.mode.value),
            r: this.state.colorValues.r,
            g: this.state.colorValues.g,
            b: this.state.colorValues.b
        });
    },

    render: function () {
        var _ = this;
        return (
            <form onSubmit={this.send}>
                <div className='row'>
                    {this.props.modes.map(function (mode, i) {
                        return (
                            <div className='col-sm-3'>
                                <input type='radio' name='mode' value={i} id={'mode' + i} ref='modeValue' />
                                <label for={'mode' + i}>{mode}</label>
                            </div>
                        );
                    })}
                </div>
                {this.props.colors.map(function (color) {
                    return <Slider key={color.id} id={color.id} label={color.label} value={_.state.colorValues[color.id]} updateColor={_.updateColor} />;
                })}
                <div style={{background: hexColor(this.state.colorValues)}}>&nbsp;</div>
                <button>Send</button>
            </form>
        );
    }
});


var colors = [
    {id: 'r', label: 'Red'},
    {id: 'g', label: 'Green'},
    {id: 'b', label: 'Blue'}
];

var modes = [
    'Fade',
    'Wipe',
    'Marquee',
    'Rainbow'
];

React.render(<ColorForm colors={colors} modes={modes} action='/color' />, document.getElementById('form'));

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

    sendColor: function () {
        $.post(this.props.action, this.state.colorValues);
    },

    render: function () {
        var _ = this;
        return (
            <div>
                {this.props.colors.map(function (color) {
                    return <Slider key={color.id} id={color.id} label={color.label} value={_.state.colorValues[color.id]} updateColor={_.updateColor} />;
                })}
                <div style={{background: hexColor(this.state.colorValues)}}>&nbsp;</div>
                <button onClick={this.sendColor}>Send</button>
            </div>
        );
    }
});

var colors = [
    {id: 'r', label: 'Red'},
    {id: 'g', label: 'Green'},
    {id: 'b', label: 'Blue'}
];

React.render(<ColorForm colors={colors} action='/color' />, document.getElementById('form'));

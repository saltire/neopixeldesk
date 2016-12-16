class Color {
    constructor(r, g, b) {
        this.r = Number(r) || 0;
        this.g = Number(g) || 0;
        this.b = Number(b) || 0;
    }

    format() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}

const channels = [
    {id: 'r', label: 'Red'},
    {id: 'g', label: 'Green'},
    {id: 'b', label: 'Blue'}
];

Vue.component('color-select', {
    props: ['mode', 'name', 'label'],
    data() {
        return {
            color: new Color(0, 0, 255),
            channels,
            idPrefix: `${this.mode}-${this.name}-`
        };
    },
    template: (
        '<div>' +
            '<h3>{{ label }}</h3>' +
            '<div v-for="channel in channels" :key="channel.id" class="row">' +
                '<div class="col-sm-2 col-xs-6"><label v-bind:for="idPrefix + channel.id">{{ channel.label }}</label></div>' +
                '<div class="col-sm-1 col-xs-6">{{ color[channel.id] }}</div>' +
                '<div class="col-sm-9 col-xs-12">' +
                    '<input type="range" min="0" max="255" v-bind:id="idPrefix + channel.id" v-model="color[channel.id]">' +
                '</div>' +
            '</div>' +
            '<div v-bind:style="{ background: color.format() }">&nbsp;</div>' +
        '</div>'
    )
});

Vue.component('number-range', {
    props: ['mode', 'name', 'label', 'min', 'max', 'initialValue'],
    data() {
        return {
            id: `${this.mode}-${this.name}`,
            value: this.initialValue
        };
    },
    template: (
        '<div class="row">' +
            '<div class="col-sm-2 col-xs-6"><label v-bind:for="id">{{ label }}</label></div>' +
            '<div class="col-sm-1 col-xs-6">{{ value }}</div>' +
            '<div class="col-sm-9 col-xs-12">' +
                '<input type="range" v-bind:min="min" v-bind:max="max" v-bind:id="id" v-model="value">' +
            '</div>' +
        '</div>'
    )
});

Vue.component('module-fade', {
    props: ['initialProps'],
    template: (
        '<div>' +
            '<color-select mode="Fade" name="color1" label="Color" v-bind:initial-value="initialProps.color1"></color-select>' +
            '<number-range mode="Fade" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration"></number-range>' +
        '</div>'
    )
});

Vue.component('module-wipe', {
    props: ['initialProps'],
    template: (
        '<div>' +
            '<color-select mode="Wipe" name="color1" label="Color" v-bind:initial-value="initialProps.color1"></color-select>' +
            '<number-range mode="Wipe" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration"></number-range>' +
        '</div>'
    )
});

Vue.component('module-marquee', {
    props: ['initialProps'],
    template: (
        '<div>' +
            '<color-select mode="Marquee" name="color1" label="Primary Color" v-bind:initial-value="initialProps.color1"></color-select>' +
            '<number-range mode="Marquee" name="length1" label="Primary Color Length" min="1" max="150" v-bind:initial-value="initialProps.length1"></number-range>' +
            '<color-select mode="Marquee" name="color2" label="Secondary Color" v-bind:initial-value="initialProps.color2"></color-select>' +
            '<number-range mode="Marquee" name="length2" label="Secondary Color Length" min="1" max="150" v-bind:initial-value="initialProps.length2"></number-range>' +
            '<number-range mode="Marquee" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration"></number-range>' +
        '</div>'
    )
});

Vue.component('module-rainbow', {
    props: ['initialProps'],
    template: (
        '<div>' +
            '<number-range mode="Rainbow" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration"></number-range>' +
            '<number-range mode="Rainbow" name="length" label="Length (pixels)" min="1" max="600" v-bind:initial-value="initialProps.length"></number-range>' +
        '</div>'
    )
});

Vue.component('module-pulse', {
    props: ['initialProps'],
    template: (
        '<div>' +
            '<color-select mode="Marquee" name="color1" label="Primary Color" v-bind:initial-value="initialProps.color1"></color-select>' +
            '<color-select mode="Marquee" name="color2" label="Secondary Color" v-bind:initial-value="initialProps.color2"></color-select>' +
            '<number-range mode="Pulse" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration"></number-range>' +
        '</div>'
    )
});

const app = new Vue({
    el: '#form',
    data: {
        currentMode: 'Fade',
        modes: {
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
    }
});

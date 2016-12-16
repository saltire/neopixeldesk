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

const channels = {
    r: 'Red',
    g: 'Green',
    b: 'Blue',
};

Vue.component('color-select', {
    props: ['mode', 'name', 'label', 'initialValue'],
    data() {
        return {
            color: new Color(this.initialValue.r, this.initialValue.g, this.initialValue.b),
            channels,
            idPrefix: `${this.mode}-${this.name}-`
        };
    },
    methods: {
        change() {
            this.$emit('update', this.mode, this.name, this.color);
        }
    },
    template: (
        '<div>' +
            '<h3>{{ label }}</h3>' +
            '<div v-for="(label, id) in channels" :key="id" class="row">' +
                '<div class="col-sm-2 col-xs-6"><label v-bind:for="idPrefix + id">{{ label }}</label></div>' +
                '<div class="col-sm-1 col-xs-6">{{ color[id] }}</div>' +
                '<div class="col-sm-9 col-xs-12">' +
                    '<input type="range" min="0" max="255" v-bind:id="idPrefix + id" v-model="color[id]" v-on:change="change">' +
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
    methods: {
        change() {
            this.$emit('update', this.mode, this.name, Number(this.value));
        }
    },
    template: (
        '<div class="row">' +
            '<div class="col-sm-2 col-xs-6"><label v-bind:for="id">{{ label }}</label></div>' +
            '<div class="col-sm-1 col-xs-6">{{ value }}</div>' +
            '<div class="col-sm-9 col-xs-12">' +
                '<input type="range" v-bind:min="min" v-bind:max="max" v-bind:id="id" v-model="value" v-on:change="change">' +
            '</div>' +
        '</div>'
    )
});

const module = {
    props: ['initialProps'],
    methods: {
        update(mode, name, value) {
            this.$emit('update', mode, name, value);
        }
    }
};

const app = new Vue({
    el: '#form',
    components: {
        Fade: {
            extends: module,
            template: (
                '<div>' +
                    '<color-select mode="Fade" name="color1" label="Color" v-bind:initial-value="initialProps.color1" v-on:update="update"></color-select>' +
                    '<number-range mode="Fade" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration" v-on:update="update"></number-range>' +
                '</div>'
            )
        },
        Wipe: {
            template: (
                '<div>' +
                    '<color-select mode="Wipe" name="color1" label="Color" v-bind:initial-value="initialProps.color1" v-on:update="update"></color-select>' +
                    '<number-range mode="Wipe" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration" v-on:update="update"></number-range>' +
                '</div>'
            )
        },
        Marquee: {
            extends: module,
            template: (
                '<div>' +
                    '<color-select mode="Marquee" name="color1" label="Primary Color" v-bind:initial-value="initialProps.color1" v-on:update="update"></color-select>' +
                    '<number-range mode="Marquee" name="length1" label="Primary Color Length" min="1" max="150" v-bind:initial-value="initialProps.length1" v-on:update="update"></number-range>' +
                    '<color-select mode="Marquee" name="color2" label="Secondary Color" v-bind:initial-value="initialProps.color2" v-on:update="update"></color-select>' +
                    '<number-range mode="Marquee" name="length2" label="Secondary Color Length" min="1" max="150" v-bind:initial-value="initialProps.length2" v-on:update="update"></number-range>' +
                    '<number-range mode="Marquee" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration" v-on:update="update"></number-range>' +
                '</div>'
            )
        },
        Rainbow: {
            extends: module,
            template: (
                '<div>' +
                    '<number-range mode="Rainbow" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration" v-on:update="update"></number-range>' +
                    '<number-range mode="Rainbow" name="length" label="Length (pixels)" min="1" max="600" v-bind:initial-value="initialProps.length" v-on:update="update"></number-range>' +
                '</div>'
            )
        },
        Pulse: {
            extends: module,
            template: (
                '<div>' +
                    '<color-select mode="Marquee" name="color1" label="Primary Color" v-bind:initial-value="initialProps.color1" v-on:update="update"></color-select>' +
                    '<color-select mode="Marquee" name="color2" label="Secondary Color" v-bind:initial-value="initialProps.color2" v-on:update="update"></color-select>' +
                    '<number-range mode="Pulse" name="duration" label="Duration (msec)" min="100" max="10000" v-bind:initial-value="initialProps.duration" v-on:update="update"></number-range>' +
                '</div>'
            )
        }
    },
    props: ['action'],
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
    },
    methods: {
        submit(e) {
            $.ajax({
                method: 'post',
                url: e.target.attributes.action.value,
                data: {
                    mode: this.currentMode,
                    data: JSON.stringify(this.modes[this.currentMode])
                }
            });
        },
        update(mode, name, value) {
            this.modes[mode][name] = value;
        }
    }
});

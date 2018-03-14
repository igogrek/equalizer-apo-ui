<template>
    <div class="equalizer">
        <div class="sidebar">
            <div class="caption">Pream</div>
            <div class="input">
                <input type="range" orient="vertical"/>
            </div>
        </div>
        <div class="controls">
            <div class="toolbar">
                <button>Reset</button>
            </div>
            <div class="input">
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
                <div class="range"/>
            </div>
        </div>
    </div>
</template>

<script>
    import noUiSlider from 'nouislider'
    import 'nouislider/distribute/nouislider.css'

    export default {
        name: 'equalizer',
        mounted: function () {
            const ranges = document.querySelectorAll('.range');

            ranges.forEach((range, index) => {
                const rangeOptions = {
                    start: [0],
                    //
                    animate: true,
                    animationDuration: 300,
                    step: 10,
                    range: {
                        'min': [-100],
                        'max': [100]
                    },
                    orientation: 'vertical',
                    direction: 'rtl',
                    tooltips: true,
                    // pips: {
                    //     mode: 'steps',
                    //     stepped: true,
                    //     density: 4
                    // },
                    format: {
                        to: function (value) {
                            return parseInt(value);
                        },
                        from: function (value) {
                            return value;
                        }
                    }
                };

                if (index == ranges.length - 1) {
                    rangeOptions.pips = {
                        mode: 'steps',
                        stepped: true,
                        density: 2
                    };
                }

                noUiSlider.create(range, rangeOptions);
            })
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            }
        }
    }
</script>

<style lang="scss">
    .noUi-tooltip {
        display: none;
    }

    .noUi-active .noUi-tooltip {
        display: block;
    }

    .noUi-vertical {
        display: inline-block;
        margin: 20px;
        height: 400px;
    }

    html,
    body {
        height: 100%;
        overflow: hidden;
    }

    html {
        background: radial-gradient(ellipse at bottom, rgba(210, 73, 118, 1) 0%, rgba(61, 25, 136, 1));
    }

    body {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .equalizer {
        user-select: none;
        width: 1110px;
        box-shadow: 1px 1px 50px rgba(0, 0, 0, .5);
        border-radius: 4px;
        color: #484848;
        font-family: sans-serif;
        height: 550px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;

        .sidebar {
            background-color: #fff;
            width: 50px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            & .caption {
                padding: 10px 0px;
                flex-basis: 10%;
            }

        }
        .controls {
            height: 100%;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            background: #b71284;
            padding: 10px;

            .toolbar {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: row;
                padding: 10px 0px;
                justify-content: space-between;
                flex-basis: 10%;
                & button {
                    outline: 0;
                    background: rgba(255, 255, 255, .2);
                    border: 1px solid rgba(255, 255, 255, .35);
                    color: rgba(255, 255, 255, .85);
                    display: block;
                    padding: 12px 14px;
                    line-height: 0;
                    border-radius: 3px;
                }
            }
        }
    }
</style>

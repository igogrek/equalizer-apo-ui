<template>
    <div class="equalizer">
        <div class="sidebar">
            <div class="caption">Preamp</div>
            <div class="input">
                <div class="range"/>
            </div>
        </div>
        <div class="controls">
            <div class="toolbar">
                <button>Reset</button>
            </div>
            <div id="ranges">
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

            const values = [[25, 14], [40, 6.7], [63, 2.4], [100, 0], [160, 0], [250, 0], [400, 0], [630, 0.3],
                [1000, 1], [1600, 1.7], [2500, 1], [4000, 2.4], [6300, 6], [10000, 9.5], [16000, 15.2]];

            const rangesNode = document.getElementById('ranges');
            values.forEach((valueMap, index) => {
                const element = document.createElement('div');
                rangesNode.appendChild(element);

                const value = valueMap[1];
                //console.log(parseInt(value))

                const rangeOptions = {
                    start: [0],
                    animate: true,
                    animationDuration: 500,
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
                // Show pips only on last slider
                if (index === values.length - 1) {
                    rangeOptions.pips = {
                        mode: 'steps',
                        stepped: true,
                        density: 2
                    };
                }

                noUiSlider.create(element, rangeOptions);
            });
            //const ranges = document.querySelectorAll('.range');

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

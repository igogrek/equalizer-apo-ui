<template>
  <div class="equalizer">
    <div class="sidebar">
      <div class="input">
        <Slider class="tooltip-right" :value="preamp" :label="'Pre'" min="-20" max="20"
                @update="preampUpdate($event)"/>
      </div>
    </div>
    <div class="controls">
      <div class="toolbar">
        <a class="button is-small" @click="resetValues">Reset</a>
        <div class="buttons has-addons">
          <a class="button is-small" @click="minimize">_</a>
          <a class="button is-small" @click="close">X</a>
        </div>
      </div>
      <div class="equalizer-container">
        <div class="columns is-mobile is-gapless">
          <div class="column" v-for="(value, index) in valueMap" :class="{'is-narrow': index === valueMap.length - 1}">
            <Slider
                    :value="value[1]"
                    :label="value[0]"
                    :show-scale="index === valueMap.length - 1"
                    :reset="reset"
                    @update="sliderUpdate($event, index)"/>
          </div>
        </div>

        <Chart :chart-data="chartData" :labels="labels"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Slider from './Slider.vue';
  import Chart from './Chart.vue';
  import * as fs from 'fs';

  const EQ_LINE_START = 'GraphicEQ:';

  export default {
    name: 'Equalizer',
    components: {Slider, Chart},
    data: function () {
      return {
        reset: false,
        resetCount: 0,
        preamp: 0,
        // TODO generate or remove
        valueMap: [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],
          [0, 0]]
      }
    },
    computed: {
      labels: function () {
        return this.valueMap.map(value => value[0]);
      },
      chartData: function () {
        return this.valueMap.map(value => value[1]);
      }
    },
    mounted: function () {
      this.parseConfig();
    },
    methods: {
      parseConfig() {
        const configPath = 'C:/Program Files/EqualizerAPO/config/config.txt';
        fs.readFile(configPath, (err, data) => {
          if (err) return console.error(err);

          const lines = data.toString().split(`\n`);
          if (lines.length > 1) {
            let preampLine = lines[0];
            this.preamp = parseFloat(preampLine.replace('Preamp: ', '').replace(' dB', ''));

            let eqLine = lines[1];

            if (eqLine.startsWith(EQ_LINE_START)) {
              eqLine = eqLine.replace(EQ_LINE_START, '');

              this.valueMap = [];
              eqLine.split(';').forEach(part => {
                const eqMap = part.trim().split(' ');
                this.valueMap.push([Number(eqMap[0]), Number(eqMap[1])])
              });
            }
          }
        });
      },
      buildConfig() {
        let config = `Preamp: ${this.preamp} dB\n`;
        config += EQ_LINE_START;
        this.valueMap.forEach((map, index) => {
          config += ` ${map[0]} ${map[1]}`;
          if (index !== this.valueMap.length - 1) {
            config += ';';
          }
        });
        return config;
      },
      writeConfig() {
        const configPath = 'C:/Program Files/EqualizerAPO/config/config.txt';
        fs.writeFile(configPath, this.buildConfig(), (err) => {
          if (err) return console.log(err);
        });
      },
      resetValues() {
        this.valueMap = this.valueMap.map(value => [value[0], 0]);
        this.reset = true;
        this.resetCount = this.valueMap.length
      },
      minimize() {
        this.$electron.remote.BrowserWindow.getFocusedWindow().minimize()
      },
      close() {
        this.$electron.remote.app.quit()
      },
      sliderUpdate(value, index) {
        if (this.reset) {
          this.resetCount -= 1;
          this.reset = this.resetCount !== 0;
        }

        this.$set(this.valueMap, index, [this.valueMap[index][0], value]);

        // Skip initial value sets for writing the config
        if (this.valueMap[0][0]) {
          this.writeConfig();
        }
      },
      preampUpdate(value) {
        this.preamp = value;
        this.writeConfig();
      }
    }
  }
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/_all';
  @import '~bulma/sass/base/_all';
  @import '~bulma/sass/grid/columns';
  @import '~bulma/sass/elements/button';

  .equalizer-container {
    position: relative;
    height: 100%;
    background: #25313b;
    padding: 10px;
    border-radius: 4px;
    margin-left: 5px;
  }

  .columns.is-mobile.is-gapless {
    margin-bottom: 0;
  }

  .column.is-narrow {
    width: 77px;
  }

  // Disable window dragging
  .button, .noUi-vertical {
    -webkit-app-region: no-drag;
  }

  .button {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, .35);
    color: rgba(255, 255, 255, .85);

    &.is-small {
      border-radius: 3px;
    }

    &:hover {
      color: rgba(255, 255, 255, .85);
      border: 1px solid white !important;
    }
  }

  .tooltip-right {
    .noUi-vertical .noUi-tooltip {
      right: -40px;
    }
  }

  html,
  body {
    height: 100%;
    overflow: hidden;
  }

  html {
    background: transparent;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    // TODO enable adter debug
    //-webkit-app-region: drag;
  }

  .equalizer {
    user-select: none;
    width: calc(100vw - 20px);
    box-shadow: 1px 1px 25px rgba(0, 0, 0, .5);
    border-radius: 4px;
    color: #484848;
    font-family: sans-serif;
    height: calc(100% - 20px);
    margin: 10px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    .sidebar {
      background: #25313b;
      width: 50px;
      height: 100%;
      padding: 57px 21px;

      .caption {
        padding: 10px 0px;
        flex-basis: 10%;
      }

    }
    .controls {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      background: #1e2931;
      padding: 10px;

      .ranges {
        padding: 0 40px;
      }

      .toolbar {
        display: block;
        padding-bottom: 10px;

        .buttons {
          position: absolute;
          right: 20px;
          top: 20px;
        }
      }
    }
  }
</style>

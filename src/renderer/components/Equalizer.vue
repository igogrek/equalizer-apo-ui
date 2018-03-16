<template>
  <div class="equalizer">
    <div class="sidebar">
      <div class="input">
        <Slider :value="0" :label="'Pre'"></Slider>
      </div>
    </div>
    <div class="controls">
      <div class="toolbar">
        <a class="button is-small" @click="reset">Reset</a>
        <div class="buttons has-addons">
          <a class="button is-small" @click="minimize">_</a>
          <a class="button is-small" @click="close">X</a>
        </div>
      </div>
      <div class="chart-container">
        <div class="columns is-mobile is-gapless">
          <div class="column" v-for="(value, index) in valueMap" :class="{'is-narrow': index === valueMap.length - 1}">
            <Slider
                    :value="value[1]"
                    :label="value[0]"
                    :show-scale="index === valueMap.length - 1"
                    @update="sliderUpdate($event, index)"/>
          </div>
        </div>

        <canvas id="chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from 'chart.js';
  import Slider from './Slider.vue';

  export default {
    name: 'Equalizer',
    components: {Slider},
    data: function () {
      return {
        chart: null,
        valueMap: [[25, 50], [40, 40.7], [63, 32.4], [100, 1], [160, 5], [250, 7], [400, 0], [630, 0.3],
          [1000, 1], [1600, 1.7], [2500, 1], [4000, 2.4], [6300, 6], [10000, 9.5], [16000, 15.2]]
      }
    },
    mounted: function () {

      const ctx = document.getElementById('chart').getContext('2d');

      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, '#ff976f');
      gradient.addColorStop(1, '#9850e9');


      this.chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: this.valueMap.map(value => value[0]),
          datasets: [{
            backgroundColor: gradient,
            //borderColor: '#ff976f',
            pointRadius: 0, // Do not show dots
            data: this.valueMap.map(value => value[1]),
          }]
        },

        // Configuration options go here
        options: {
          maintainAspectRatio: false,
          animation: {
            duration: 500
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                display: false
              }
            }],
            yAxes: [{
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                display: false,
                max: 100,
                min: -100
              }
            }]
          }
        }
      });
    },
    methods: {
      reset() {
        this.valueMap.forEach((value, index) => {
          //this.valueMap.$set(index, )
          this.valueMap.splice(index, 1, [value[0], 0]);
        });
      },
      minimize() {
        this.$electron.remote.BrowserWindow.getFocusedWindow().minimize()
      },
      close() {
        this.$electron.remote.app.quit()
      },
      sliderUpdate(values, index) {
        if (this.chart) {
          this.chart.data.datasets[0].data[index] = Number(values[0]);
          this.chart.update();
        }
        //this.valueMap.splice(index, 1, [this.valueMap[index][0], Number(values[0])]);
      },
    }
  }
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/_all';
  @import '~bulma/sass/base/_all';
  @import '~bulma/sass/grid/columns';
  @import '~bulma/sass/elements/button';
  @import '~nouislider/distribute/nouislider.css';

  // Show tooltip only on click
  .noUi-tooltip {
    display: none;
  }

  .noUi-active .noUi-tooltip {
    display: block;
  }

  .chart-container {
    position: relative;
    height: 100%;
    background: #25313b;
    padding: 10px;
    border-radius: 4px;
    margin-left: 5px;

    #chart {
      position: absolute;
      top: 0;
      width: calc(100% - 96px) !important;
    }
  }

  .columns.is-mobile.is-gapless {
    margin-bottom: 0;
    // TODO add centered text
    //    margin-left: -24px;
    //    margin-right: 34px;

  }

  .column.is-narrow {
    width: 77px;
  }

  .noUi-vertical {
    display: inline-block;
    height: calc(100vh - 130px);
    width: 10px;
    cursor: pointer;
    z-index: 1;

    .noUi-handle {
      cursor: -webkit-grab;
      width: 20px;
      height: 24px;

      &:before {
        width: 6px;
        top: 9px;
      }

      &:after {
        width: 6px;
        top: 12px;
      }

      &.noUi-active {
        cursor: -webkit-grabbing;
      }
    }

    .noUi-connect {
      background: linear-gradient(#02e0c4, #3c96e5);
    }
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

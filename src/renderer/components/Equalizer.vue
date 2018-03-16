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
        <a class="button is-small" @click="reset">Reset</a>
        <a class="button is-small is-pulled-right" @click="close">X</a>
      </div>
      <div class="chart-container">
        <div id="ranges" class="columns is-mobile"></div>
        <canvas id="chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import noUiSlider from 'nouislider'
  import Chart from 'chart.js';
  import 'nouislider/distribute/nouislider.css'

  export default {
    name: 'equalizer',
    mounted: function () {

      const values = [[25, 50], [40, 40.7], [63, 32.4], [100, 1], [160, 5], [250, 7], [400, 0], [630, 0.3],
        [1000, 1], [1600, 1.7], [2500, 1], [4000, 2.4], [6300, 6], [10000, 9.5], [16000, 15.2]];

      const ctx = document.getElementById('chart').getContext('2d');


      const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: values.map(value => value[0]),
          datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'blue',
            pointRadius: 0, // Do not show dots
            data: values.map(value => value[1]),
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

      const rangesNode = document.getElementById('ranges');
      values.forEach((valueMap, index) => {

        const div = document.createElement('div');
        div.className = 'column';

        rangesNode.appendChild(div);

        const element = document.createElement('div');
        div.appendChild(element);

        const rangeOptions = {
          start: [valueMap[1]],
          animate: true,
          animationDuration: 500,
          range: {
            'min': [-100],
            'max': [100]
          },
          orientation: 'vertical',
          direction: 'rtl',
          tooltips: true,
          connect: [true, false]
        };
        // Show pips only on last slider
        if (index === values.length - 1) {
          rangeOptions.pips = {
            mode: 'values',
            values: [-100, -75, -50, -25, 0, 25, 50, 75, 100],
            stepped: true,
            density: 3
          };
        }

        noUiSlider.create(element, rangeOptions);

        element.noUiSlider.on('update', values => {
          chart.data.datasets[0].data[index] = Number(values[0]);
          chart.update();
        });
      });
    },
    methods: {
      reset() {
        document.querySelectorAll('#ranges > div > div').forEach(range => {
          range.noUiSlider.set(0)
        })
      },
      close() {
        this.$electron.remote.app.quit()
      },
    }
  }
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/_all';
  @import '~bulma/sass/base/_all';
  @import '~bulma/sass/grid/columns';
  @import '~bulma/sass/elements/button';

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
  }

  #chart {
    position: absolute;
    top: 0;
    width: 100%;
  }

  .noUi-vertical {
    display: inline-block;
    height: calc(100vh - 100px);
    cursor: pointer;

    .noUi-handle {
      cursor: -webkit-grab;

      &.noUi-active {
        cursor: -webkit-grabbing;
      }
    }
  }

  // Disable window dragging
  .button, .noUi-vertical {
    -webkit-app-region: no-drag;
  }

  .button {
    //background: transparent;
    //color: white;

    background: rgba(255, 255, 255, .2);
    border: 1px solid rgba(255, 255, 255, .35);
    color: rgba(255, 255, 255, .85);

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
    background: radial-gradient(ellipse at bottom, rgba(210, 73, 118, 1) 0%, rgba(61, 25, 136, 1));
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
    width: 100vw;
    max-width: 1000px;
    box-shadow: 1px 1px 50px rgba(0, 0, 0, .5);
    border-radius: 4px;
    color: #484848;
    font-family: sans-serif;
    height: calc(100% - 40px);
    margin: 20px;

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
      background: #b71284;
      padding: 10px;

      .ranges {
        padding: 0 40px;
      }

      .toolbar {

        display: block;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 10px;
      }
    }
  }
</style>

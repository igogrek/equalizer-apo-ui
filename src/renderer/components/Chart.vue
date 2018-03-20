<template>
  <canvas id="chart"></canvas>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    name: 'Slider',
    props: {
      chartData: Array,
      labels: Array,
    },
    data: function () {
      return {
        chart: null
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
          labels: this.labels,
          datasets: [{
            backgroundColor: gradient,
            //borderColor: '#ff976f',
            pointRadius: 0, // Do not show dots
            data: [],
            cubicInterpolationMode: 'monotone'
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
    watch: {
      chartData: function (newVal, oldVal) {
        if (newVal) {

          if (this.chart) {
            this.chart.data.datasets[0].data = newVal;
            this.chart.update();
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  #chart {
    position: absolute;
    top: 0;
    width: calc(100% - 96px) !important;
    height: calc(100% - 45px) !important;
    top: 11px;
  }
</style>

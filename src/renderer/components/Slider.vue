<template>
  <div>
    <div ref="slider">

    </div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<script>
  import noUiSlider from 'nouislider'

  export default {
    name: 'Slider',
    props: {
      value: Number,
      label: [String, Number],
      showScale: Boolean
    },
    mounted: function () {
        const rangeOptions = {
          start: [this.value],
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

        if (this.showScale) {
          rangeOptions.pips = {
            mode: 'values',
            values: [-100, -75, -50, -25, 0, 25, 50, 75, 100],
            stepped: true,
            density: 3
          };
        }

        noUiSlider.create(this.$refs.slider, rangeOptions);

      this.$refs.slider.noUiSlider.on('update', values => {
        this.$emit('update', values)
      });
    },
    watch: {
      value: function(newVal, oldVal) {
        console.log(newVal)
        this.$refs.slider.noUiSlider.set(newVal);
      }
    }
  }
</script>

<style lang="scss">
  .label {
    margin-left: -7px;
    color: #999999;
  }
</style>

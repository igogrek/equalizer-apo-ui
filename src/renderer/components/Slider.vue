<template>
  <div>
    <div ref="slider">

    </div>
    <div>{{ label }}</div>
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
    }
  }
</script>

<style lang="scss">
</style>

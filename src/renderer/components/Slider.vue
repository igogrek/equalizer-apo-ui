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
      showScale: Boolean,
      reset: Boolean,
      min: String,
      max: String
    },
    data: function () {
      return {
        lastValue: 0,
        selfUpdate: false
      }
    },
    mounted: function () {
      const rangeOptions = {
        start: [this.value],
        animate: true,
        animationDuration: 500,
        range: {
          min: [this.min ? Number(this.min) : -100],
          max: [this.max ? Number(this.max) : 100]
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
        // Send number as slider value
        const value = Number(values[0]);

        if (this.lastValue != value) {
          this.$emit('update', value)
          this.lastValue = value;
          this.selfUpdate = true;
        }
      });
    },
    watch: {
      value: function (newVal, oldVal) {
        if (newVal && !this.selfUpdate) {
          this.$refs.slider.noUiSlider.set(this.value);
        }
        this.selfUpdate = true;
      },
      reset: function (newVal, oldVal) {
        if (newVal) {
          this.$refs.slider.noUiSlider.set(0);
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~nouislider/distribute/nouislider.css';

  .noUi-vertical {
    display: inline-block;
    height: calc(100vh - 130px);
    width: 10px;
    cursor: pointer;
    z-index: 1;

    .noUi-handle {
      cursor: -webkit-grab;
      top: -9px;
      border-radius: 50%;
      height: 18px;
      width: 18px;
      left: -5px;

      &:before {
        left: 5px;
        width: 6px;
        top: 6px;
      }

      &:after {
        left: 5px;
        width: 6px;
        top: 10px;
      }

      &.noUi-active {
        cursor: -webkit-grabbing;
      }
    }

    .noUi-connect {
      background: linear-gradient(#02e0c4, #3c96e5);
    }

    // Show tooltip only on click
    .noUi-tooltip {
      display: none;
      padding: 2px;
    }

    .noUi-active .noUi-tooltip {
      display: block;
    }
  }

  .label {
    margin-left: -7px;
    color: #999999;
  }
</style>

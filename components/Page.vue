<template>
  <div>
    <nuxt-link />
    <svg-icon />
    <base-button>
    <main-image>
  </div>
</template>

<script lang="ts">
import BaseButton from './BaseButton.vue';
import MainImage from './MainImage.vue';

const SvgIcon = defineAsyncComponent(() => import('~/some-path'));

export default defineNuxtComponent({
  name: 'Page',
  components: {
    BaseButton,
    SvgIcon
  }

})
</script>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

</style>
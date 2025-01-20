<template>
  <div>
    <main-image alt="test" />
    <some-tag />
  </div>
</template>

<script lang="ts">
  const MainImage = defineAsyncComponent(() => import('./MainImage.vue'));
export default defineNuxtComponent({
  name: 'BaseButton',
  components: {
    // SomeTag: () => import('some tag')
  }

})
</script>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

</style>
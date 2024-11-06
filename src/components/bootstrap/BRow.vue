<template>
  <div class="row">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
interface IProps {}
const props = withDefaults(defineProps<IProps>(), {})
</script>

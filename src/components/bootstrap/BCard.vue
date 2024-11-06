<template>
  <div class="card">
    <div class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-foter">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
interface IProps {}
const props = withDefaults(defineProps<IProps>(), {})
</script>

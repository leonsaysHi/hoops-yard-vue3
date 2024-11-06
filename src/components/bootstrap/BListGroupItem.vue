<template>
  <li class="list-group-item">
    <slot></slot>
  </li>
</template>
<script setup lang="ts">
interface IProps {}
const props = withDefaults(defineProps<IProps>(), {})
</script>

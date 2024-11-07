<template>
  <a class="navbar-brand"><slot></slot></a>
</template>
<script setup lang="ts">
interface IProps {}
const props = withDefaults(defineProps<IProps>(), {})
</script>

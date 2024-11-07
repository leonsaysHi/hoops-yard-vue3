<template>
  <ul class="navbar-nav">
    <slot></slot>
  </ul>
</template>
<script setup lang="ts">
interface IProps {
}
const props = withDefaults(defineProps<IProps>(), {
})
</script>

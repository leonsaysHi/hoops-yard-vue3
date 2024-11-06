<template>
  <div :class="props.fluid ? 'container-fluid' : 'container'">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
interface IProps {
  fluid?: boolean
}
const props = withDefaults(defineProps<IProps>(), {})
</script>

<template>
  <div class="alert" :class="computedClasses" role="alert">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  variant?: string
}
const props = withDefaults(defineProps<IProps>(), {
  variant: 'primary'
})
const computedClasses = computed(() => {
  const result = [`alert-${props.variant}`]
  return result.join(' ')
})
</script>

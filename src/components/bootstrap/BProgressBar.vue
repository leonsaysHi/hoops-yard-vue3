<template>
  <div :class="computedClasses" :style="`width: ${props.value}%`">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  value: number
  variant?: string
}
const props = withDefaults(defineProps<IProps>(), {
  variant: 'primary'
})
const computedClasses = computed(() => {
  const result = [`progress-bar`, `bg-${props.variant}`]
  return result.join(' ')
})
</script>

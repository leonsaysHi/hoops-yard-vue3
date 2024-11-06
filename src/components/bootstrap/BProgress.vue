<template>
  <div
    class="progress"
    :max="props.max"
    role="progressbar"
    aria-valuenow="0"
    :aria-valuemin="props.min"
    :aria-valuemax="props.max"
    :style="computedStyles"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  min?: number
  max?: number
  height?: string
}
const props = withDefaults(defineProps<IProps>(), {
  min: 0,
  max: 100,
  height: '1rem'
})
const computedStyles = computed(() => {
  const result = [`height: ${props.height}`]
  return result.join(';')
})
</script>

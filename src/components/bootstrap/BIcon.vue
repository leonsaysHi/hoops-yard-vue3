<template>
  <i :class="computedClasses"></i>
</template>
<script setup lang="ts">
import type { Variant } from '@/types/components';
import { computed } from 'vue'

interface IProps {
  icon: string
  variant?: Variant
}
const props = withDefaults(defineProps<IProps>(), {
    variant: undefined
})
const computedClasses = computed(() => {
  const result = [`bi bi-${props.icon}`]
  if (props.variant) {
    result.push(`text-${props.variant}`)
  }
  return result.join(' ')
})
</script>

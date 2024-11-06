<template>
  <button :type="type" class="btn" :class="computedClass" :disabled="disabled || isBusy">
    <slot> </slot><template v-if="isBusy"><SpinnerComp variant="light" size="sm" /></template>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SpinnerComp from './BSpinner.vue'
import type { Size, Variant } from '@/types/components'

interface IProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: Variant
  size?: Size
  pill?: boolean
  disabled?: boolean
  isBusy?: boolean
  noFlex?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  type: 'button',
  variant: 'secondary',
  size: 'md',
  pill: false,
  disabled: false,
  isBusy: false,
  noFlex: false
})

const computedClass = computed(() => {
  const result = []
  if (typeof props.variant === 'string' && props.variant.length) {
    result.push(`btn-${props.variant}`)
  }
  if (!props.noFlex) {
    result.push('d-flex align-items-center gap-3')
  }
  if (props.size !== 'md') {
    result.push(`btn-${props.size}`)
  }
  if (props.pill) {
    result.push('rounded-pill')
  }
  return result
})
</script>

<style scoped lang="scss"></style>

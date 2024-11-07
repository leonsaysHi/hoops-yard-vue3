<template>
  <nav :class="computedClasses">
    <div class="container-fluid">
      <slot></slot>
    </div>
  </nav>
</template>
<script setup lang="ts">
import type { Variant } from '@/types/components'
import { computed } from 'vue'

interface IProps {
  toggleable?: 'sm' | 'md' | 'lg' | 'xl'
  type?: 'light' | 'dark'
  variant?: Variant | ''
}
const props = withDefaults(defineProps<IProps>(), {
  toggleable: 'lg',
  type: 'light',
  variant: ''
})
const computedClasses = computed(() => {
  const result = [
    `navbar`,
    `navbar-${props.type}`,
    `navbar-expand-${props.toggleable}`,
    `bg-${props.variant}`
  ]
  return result.join(' ')
})
</script>

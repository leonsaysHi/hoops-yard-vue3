<template>
  <div class="d-flex justify-content-center">
    <div :class="computedClass" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  grow?: boolean
  variant?: 'primary' | 'secondary' | 'light' | 'danger' | 'warning' | 'success'
  size?: 'lg' | 'md' | 'sm' | 'xs'
}
const props = withDefaults(defineProps<IProps>(), {
  grow: false,
  variant: 'secondary',
  size: 'md'
})

const computedClass = computed(() => {
  const result = []
  result.push(props.grow ? 'spinner-grow' : 'spinner-border')
  if (typeof props.variant === 'string' && props.variant.length) {
    result.push(`text-${props.variant}`)
  }
  if (props.size !== 'md') {
    result.push(`spinner-border-${props.size}`)
  }
  return result.join(' ')
})
</script>

<style scoped lang="scss"></style>

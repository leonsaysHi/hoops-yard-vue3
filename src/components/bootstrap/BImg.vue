<template>
  <img :class="computedClasses" />
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  rounded?: boolean
  fluid?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  rounded: false,
  fluid: false
})
const computedClasses = computed(() => {
  const result = []
  if (props.fluid) {
    result.push(`img-fluid`)
  }
  if (props.rounded) {
    result.push(`rounded`)
  }
  return result.join(' ')
})
</script>

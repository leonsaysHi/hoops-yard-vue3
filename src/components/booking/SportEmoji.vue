<template>
  <span>{{ emoji }}</span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface IProps {
  value: string
}
const props = withDefaults(defineProps<IProps>(), {
  value: ''
})
const emoji = computed(() => {
  return props.value === 'basket' ? '🏀' : props.value === 'volley' ? '🏐' : null
})
</script>

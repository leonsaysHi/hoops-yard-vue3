<template>
  <li class="nav-item">
    <router-link :to="props.to" :class="props.linkClasses">
      <slot></slot>
    </router-link>
  </li>
</template>
<script setup lang="ts">
interface IProps {
  to: string | {}
  linkClasses?: string
}
const props = withDefaults(defineProps<IProps>(), {
  linkClasses: undefined
})
</script>

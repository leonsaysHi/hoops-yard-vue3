<template>
  <div>
    <admin-header />
    <b-container class="py-4">
      <b-button variant="primary" @click="handleSignIn">Identificar</b-button>
      <template v-if="err">
        <p class="mt-2 text-danger">{{ err }}</p>
      </template>
      <template v-if="debug">
        <p class="text-muted">{{ debug }}</p>
      </template>
    </b-container>
  </div>
</template>

<script lang="ts" setup>
import AdminHeader from '@/components/admin/AdminHeader.vue'
import { watchEffect } from 'vue'
import useAuthentification from '@/composables/useAuthentification'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { isAdmin, logIn } = useAuthentification()

const redirect = (route.query.redirect as string) || 'AdminHome'
watchEffect(() => {
  if (isAdmin.value) {
    router.push({ name: redirect })
  }
})
const handleSignIn = () => logIn()
</script>

<template>
  <div>
    <admin-header />
    <b-container class="py-4">
      <template v-if="!userAccess">
        !!!
      </template>
      <template v-else>
        <template v-if="!isProductsReady">
          <b-spinner label="Spinning"></b-spinner>
        </template>
        <template v-else>
          <router-view />
        </template>
      </template>
    </b-container>
  </div>
</template>

<script lang="ts" setup>
import AdminHeader from '@/components/admin/AdminHeader.vue'

import useProducts from '@/composables/useProducts'
import useAuthentification from '@/composables/useAuthentification'
import { useRouter } from 'vue-router'

const router = useRouter()
import { watchEffect } from 'vue';

const { userAccess, isLogged } = useAuthentification()
const { isReady: isProductsReady } = useProducts()

watchEffect(() => {
  if (!isLogged.value) {
    router.push({ name: 'AdminLogin' })
  } 
})
</script>

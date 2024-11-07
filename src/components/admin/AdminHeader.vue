<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand class="d-flex align-items-center" :to="{ name: 'AdminHome' }">
        <b-img :src="Logo" alt="Hoops Yard" width="40" fluid></b-img>
        <div class="d-flex flex-column ms-2" style="line-height: 1rem">
          <strong class="pt-2">{{ props.title }}</strong
          ><small class="text-light" style="font-size: 0.75rem">2.0.0</small>
        </div>
      </b-navbar-brand>
      <template v-if="isLogged">
        <b-collapse>
          <b-navbar-nav class="mx-auto flex-nowrap justify-content-center">
            <b-nav-item :to="{ name: 'AdminHome' }" link-classes="px-2">
              <b-icon icon="house-door-fill" variant="light" />
            </b-nav-item>
            <template v-if="isAdmin">
              <b-nav-item :to="{ name: 'AdminProducts' }" link-classes="px-2">
                <b-icon icon="shop" variant="light" />
              </b-nav-item>
              <b-nav-item :to="{ name: 'AdminHistory' }" link-classes="px-2">
                <b-icon icon="graph-up" variant="light" />
              </b-nav-item>
            </template>
          </b-navbar-nav>
        </b-collapse>
        <b-navbar-nav class="ms-auto">
          <b-nav-item>
            <b-button variant="link" class="nav-link text-white" size="sm" @click="logOut">
              <b-icon icon="power"/>
            </b-button>
          </b-nav-item>
        </b-navbar-nav>
      </template>
    </b-navbar>
  </div>
</template>

<script lang="ts" setup>
import useAuthentification from '@/composables/useAuthentification'
import Logo from '@/assets/logo-alt.png'

interface IProps {
  title?: string
}
const props = withDefaults(defineProps<IProps>(), {
  title: 'Hoops Yard'
})
const { isAdmin, isLogged, logOut } = useAuthentification()

</script>

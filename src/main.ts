import './assets/main.scss'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import routes from './routes'
import useAuthentification from './composables/useAuthentification'
import { createRouter, createWebHistory } from 'vue-router'

import BAlert from '@/components/bootstrap/BAlert.vue'
import BButton from '@/components/bootstrap/BButton.vue'
import BCard from '@/components/bootstrap/BCard.vue'
import BCollapse from '@/components/bootstrap/BCollapse.vue'
import BContainer from '@/components/bootstrap/BContainer.vue'
import BIcon from '@/components/bootstrap/BIcon.vue'
import BImg from '@/components/bootstrap/BImg.vue'
import BListGroup from '@/components/bootstrap/BListGroup.vue'
import BListGroupItem from '@/components/bootstrap/BListGroupItem.vue'
import BNavbar from '@/components/bootstrap/BNavbar.vue'
import BNavbarBrand from '@/components/bootstrap/BNavbarBrand.vue'
import BNavbarNav from '@/components/bootstrap/BNavbarNav.vue'
import BNavItem from '@/components/bootstrap/BNavItem.vue'
import BProgress from '@/components/bootstrap/BProgress.vue'
import BProgressBar from '@/components/bootstrap/BProgressBar.vue'
import BSpinner from '@/components/bootstrap/BSpinner.vue'

import BRow from '@/components/bootstrap/BRow.vue'
import BCol from '@/components/bootstrap/BCol.vue'

import { RouterLink } from 'vue-router'

const app = createApp(App)

app.component('b-alert', BAlert)
app.component('b-button', BButton)
app.component('b-card', BCard)
app.component('b-collapse', BCollapse)
app.component('b-container', BContainer)
app.component('b-icon', BIcon)
app.component('b-img', BImg)
app.component('b-list-group-item', BListGroupItem)
app.component('b-list-group', BListGroup)
app.component('b-navbar', BNavbar)
app.component('b-navbar-brand', BNavbarBrand)
app.component('b-navbar-nav', BNavbarNav)
app.component('b-nav-item', BNavItem)

app.component('b-progress', BProgress)
app.component('b-progress-bar', BProgressBar)
app.component('b-spinner', BSpinner)

app.component('b-row', BRow)
app.component('b-col', BCol)

app.component('router-link', RouterLink)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
const { userAccess } = useAuthentification()

/*
router.beforeEach(async (to, from, next) => {
  const accessRequired = to.matched?.find((r) => Array.isArray(r.meta?.authRequired))?.meta
    ?.authRequired as string[] | undefined
  if (Array.isArray(accessRequired) && accessRequired.length > 0 && !isAdmin.value) {
    next({ name: 'AdminLogin', query: { redirect: from.name } })
  } else {
    next()
  }
})
  */
router.beforeEach(async (to, from, next) => {
  const accessRequired = Array.isArray(to.meta?.authRequired)
    ? to.meta?.authRequired
    : to.matched
      .find(r => Array.isArray(r.meta?.authRequired))?.meta?.authRequired
  console.log(accessRequired)
  const hasAccess = !Array.isArray(accessRequired) || accessRequired.length === 0
    ? true
    : userAccess.value && accessRequired.includes(userAccess.value)
  if (userAccess.value) {
    if (to.name === 'AdminLogin' || !hasAccess) {
      next({ name: 'AdminHome' })
    } else {
      next()
    }
  } else {
    if (!hasAccess) {
      next({ name: 'AdminLogin' })
    } else {
      next()
    }
  }
})

app.use(router)

app.mount('#app')

import './assets/main.scss'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import BAlert from '@/components/bootstrap/BAlert.vue'
import BButton from '@/components/bootstrap/BButton.vue'
import BCard from '@/components/bootstrap/BCard.vue'
import BContainer from '@/components/bootstrap/BContainer.vue'
import BListGroup from '@/components/bootstrap/BListGroup.vue'
import BListGroupItem from '@/components/bootstrap/BListGroupItem.vue'
import BProgress from '@/components/bootstrap/BProgress.vue'
import BProgressBar from '@/components/bootstrap/BProgressBar.vue'
import BSpinner from '@/components/bootstrap/BSpinner.vue'

import BRow from '@/components/bootstrap/BRow.vue'
import BCol from '@/components/bootstrap/BCol.vue'

const app = createApp(App)

app.component('b-alert', BAlert)
app.component('b-button', BButton)
app.component('b-card', BCard)
app.component('b-container', BContainer)
app.component('b-list-group-item', BListGroupItem)
app.component('b-list-group', BListGroup)
app.component('b-progress', BProgress)
app.component('b-progress-bar', BProgressBar)
app.component('b-spinner', BSpinner)

app.component('b-row', BRow)
app.component('b-col', BCol)

app.use(router)

app.mount('#app')

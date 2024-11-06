<template>
  <b-container fluid>
    <div class="d-flex flex-column align-items-center mt-3">
      <img src="../assets/logo-qr.png" alt="Hoops Yard" width="120" ref="logo" class="d-none" />
    </div>
    <b-card>
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <h6 class="mb-0">Su reserva con Hoops Yard:</h6>
          <h3 class="mb-0">
            <b-button
              href="https://wa.me/+50763084298"
              rel="noopener"
              target="_blank"
              variant="success"
              pill
              class="rounded-circle text-inverse"
            >
              <strong class="icon-whatsapp" />
            </b-button>
          </h3>
        </div>
      </template>

      <div class="d-flex flex-column align-items-stretch">
        <template v-if="!isReady">
          <b-spinner></b-spinner>
        </template>
        <template v-else-if="recordNotFound">
          <b-alert show variant="danger">
            <p><strong>No podemos encontrar su reserva.</strong></p>
            <p>Por favor contactanos</p>
          </b-alert>
        </template>
        <template v-else>
          <h1 class="mb-4">{{ title }}</h1>
          <h6>Reservaciones:</h6>
          <b-list-group class="w-100">
            <template v-for="booking in bookings" :key="booking.id">
              <b-list-group-item :variant="booking.isPassed ? 'light' : ''">
                <b-row>
                  <b-col>
                    <strong>{{ booking.day }}</strong>
                  </b-col>
                  <b-col class="border-left border-right">
                    <strong>{{ booking.start }}</strong>
                    <span><br />{{ booking.end }}</span>
                  </b-col>
                  <b-col>
                    <div class="d-flex mx-n1">
                      <SportEmoji class="mx-1" :value="booking.sport" />
                      <template v-if="booking.scoreboard"> ⏱️ </template>
                    </div>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </template>
          </b-list-group>
          <h6 class="mt-3">Estado del pago:</h6>
          <b-progress :min="0" :max="record.amount" height="1.75rem" show-value>
            <template v-if="paymentsBar">
              <b-progress-bar :value="paymentsBar.success" variant="success">
                <strong>Pagado</strong>
              </b-progress-bar>
              <b-progress-bar :value="paymentsBar.warning" variant="warning">
                <strong>${{ displayAmount(paymentsBar.warning) }} pendientes</strong>
              </b-progress-bar>
              <b-progress-bar :value="paymentsBar.danger" variant="danger">
                <strong>${{ displayAmount(paymentsBar.danger) }} pendientes</strong>
              </b-progress-bar>
            </template>
          </b-progress>
          <div class="mt-4 text-center">
            <template v-if="!isQRReady">
              <b-spinner></b-spinner>
            </template>
            <template v-else>
              <q-r-canvas :options="qrOptions" />
              <p>
                <small class="text-muted">
                  {{ qrOptions.data }}
                </small>
              </p>
            </template>
          </div>
        </template>
      </div>
    </b-card>
  </b-container>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted, watch, useTemplateRef } from 'vue'
import { format, isBefore, startOfDay, add, compareDesc } from 'date-fns'
import { displayAmount } from '@/utils/display-utils'
import { Record } from '@/models/Record'
import { getRecord } from '@/firebase-firestore'
// import { mapGetters, mapActions } from 'vuex'
import SportEmoji from '@/components/booking/SportEmoji.vue'
import { QRCanvas } from 'qrcanvas-vue'
import type { QRCanvasOptions } from 'qrcanvas'
import useProducts from '@/composables/useProducts'
import useVueRouter from '@/composables/useVueRouter'
import type { Product } from '@/types'

const { isReady: isProductsReady, get: getProduct } = useProducts()
const { route } = useVueRouter()

const recordNotFound = ref(false)
const record = ref<Record | null>(null)
const qrOptions: QRCanvasOptions = {
  padding: 8,
  cellSize: 7,
  correctLevel: 'H',
  logo: undefined,
  data: undefined
}
const logoImg = useTemplateRef('logo')

onBeforeMount(() => {
  getProducts()
})
onMounted(() => {
  const image = new Image()
  console.log(logoImg.value)
  const src = logoImg.value.src
  image.src = src
  image.onload = () => {
    qrOptions.logo = { image }
  }
})



watch(
  isProductsReady,
  (isReady) => {
    if (isReady) {
      const { id } = route.params
      if (typeof id === 'string') {
        getRecord(id).then((row) => {
          if (row) {
            record.value = new Record(row)
            qrOptions.data = window.location.origin + route.path
          } else {
            recordNotFound.value = true
          }
        })
      }
    }
  },
  { immediate: true }
)

const isReady = computed(() => {
  return Boolean(record.value || recordNotFound.value)
})
const isQRReady = computed(() => {
  return Boolean(qrOptions.logo && qrOptions.data)
})
const recordProduct = computed<Product | undefined>(() => {
  return typeof record.value?.productId === 'string'
    ? getProduct(record.value.productId)
    : undefined
})
const paid = computed(() => {
  return Array.isArray(record.value?.payments)
    ? record.value.payments.reduce((sum, p) => sum + p.amount, 0)
    : 0
})
const paymentsBar = computed<{} | undefined>(() => {
  const amount = record.value?.amount
  if (typeof amount !== 'number') {
    console.warn('amount is not a number', record.value)
    return undefined
  }
  const leftToPay = amount - paid.value
  const perc = (n: number) => (n * 100) / amount
  return {
    success: perc(paid.value),
    warning: paid.value > 0 ? perc(leftToPay) : 0,
    danger: paid.value === 0 ? perc(leftToPay) : 0
  }
})
const title = computed(() => {
  return isReady.value
    ? typeof record.value?.title === 'string' && record.value.title.trim().length
      ? record.value.title
      : recordProduct.value
      ? recordProduct.value?.productName
      : null
    : null
})
const bookings = computed(() => {
  const results =
    isReady.value && Array.isArray(record.value?.bookings)
      ? record.value.bookings.map((booking) => {
          const product = getProduct(booking.productId)
          return {
            dateStart: booking.dateStart,
            day: format(booking.dateStart, 'EEEE do LLL.'),
            start: format(booking.dateStart, 'p'),
            end: format(add(booking.dateEnd, { seconds: 1 }), 'p'),
            court: product ? product.productName : null,
            sport: booking.sport,
            scoreboard: booking.scoreboard,
            isPassed: isBefore(booking.dateStart, startOfDay(new Date()))
          }
        })
      : []
  results.sort((a, b) => {
    return compareDesc(a.dateStart, b.dateStart)
  })
  return results
})

const getProducts = () => 'getProducts'
</script>

<template>
  <div>
    Cash!
    <!--
    <div class="mb-4 mx-n2 d-flex align-items-stretch">
      <b-button-group class="mx-2 d-flex flex-grow-1">
        <b-button
          class="py-3 d-flex flex-grow-1 align-items-center justify-content-center"
          variant="primary"
          :to="{ name: 'EditRecord', params: { id: null } }"
        >
          <b-icon-plus font-scale="2" />
        </b-button>
        <b-button
          class="py-3 flex-grow-1 d-flex align-items-center justify-content-center"
          variant="primary"
          :to="{ name: 'EditRecord', params: { newRecord: { categorieId: 'shop' } } }"
        >
          <b-icon-shop font-scale="2" />
        </b-button>
      </b-button-group>
      <b-button
        class="mx-2 flex-grow-1 d-flex align-items-center justify-content-center"
        variant="primary"
        :to="{ name: 'BookingsView' }"
      >
        <b-icon-calendar3 />
      </b-button>
      <b-button
        class="mx-2 flex-grow-1 d-flex align-items-center justify-content-center"
        variant="primary"
        :to="{ name: 'Estimation' }"
      >
        <b-icon-printer-fill />
      </b-button>
    </div>
    <template v-if="isAdmin">
      <b-form-group>
        <b-form-datepicker v-model="dayInput" :start-weekday="1"></b-form-datepicker>
      </b-form-group>
    </template>
    <template v-else>
      <h5>{{ dayString }}</h5>
    </template>
    <Register :key="dayInput" :date="date" />
    -->
  </div>
</template>

<script lang="ts" setup>
/*
import Register from '@/components/register/DayRegister.vue'
import { format, parseISO, isSameDay } from 'date-fns'
import { dateToDayValue } from '@/utils/Dates'
import { mapGetters } from 'vuex'
export default {
  components: {
    Register
  },
  data() {
    return {
      date: new Date()
    }
  },
  computed: {
    ...mapGetters('user', {
      isAdmin: 'isAdmin'
    }),
    dayString() {
      return format(this.date, "EEEE do 'de' MMMM")
    },
    dayInput: {
      get: function () {
        return dateToDayValue(this.date)
      },
      set: function (d) {
        const date = parseISO(d)
        if (!isSameDay(date, this.date)) {
          this.date = date
        }
      }
    },
    paymentsByPaymentOptions() {
      return Array.isArray(this.paymentOptions)
        ? this.paymentOptions.map(({ value, text }) => {
            const amount = this.records.reduce((acc, r) => {
              const sum = r.payments
                .filter((p) => p.paidWith === value)
                .reduce((s, p) => s + p.amount, 0)
              return acc + sum
            }, 0)
            return { value, amount, text }
          })
        : []
    },
    amountTotal() {
      return Array.isArray(this.records)
        ? this.records.reduce((acc, r) => {
            const sum = r.payments.reduce((s, p) => s + p.amount, 0)
            return acc + sum
          }, 0)
        : 0
    },
    unpaidBookings() {
      return Array.isArray(this.registerBookings)
        ? this.registerBookings.filter((booking) => {
            const categorie = this.getCategorie(booking.record.categorieId)
            const { amount, amountPaid } = booking.record
            return (!categorie.adminOnly || this.isAdmin) && amount > amountPaid
          })
        : []
    }
  },
  methods: {
    handleEdit(id) {
      this.$router.push({ name: 'EditRecord', params: { id } })
    }
  }
}*/
</script>
<style lang="scss" scoped>
.btn-group {
  position: relative;
  &:after {
    content: '';
    z-index: 2;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 66%;
    background-color: white;
  }
}
</style>

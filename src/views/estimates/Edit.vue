<template>
  <div>
    <b-container class="py-4">
      <h3>Editar documnento</h3>
      <b-form @submit="handleSubmit">
        <b-row>
          <b-col cols="auto">
            <b-form-group label="Tipo de documento">
              <b-form-radio-group
                v-model="type"
                button-variant="outline-primary"
                :options="typesOptions"
                buttons
              />
            </b-form-group>
          </b-col>
          <b-col>
            <template v-if="type === 'bill'">
              <b-form-group label="# Factura">
                <b-form-input v-model.trim="data.billNumber"></b-form-input>
              </b-form-group>
            </template>
          </b-col>
        </b-row>
        <b-form-group label="Fecha">
          <b-form-datepicker v-model="data.date" :state="isDateValid" :start-weekday="1" />
        </b-form-group>
        <b-form-group label="Cliente">
          <b-form-input v-model="data.client"></b-form-input>
        </b-form-group>
        <b-form-group label="Titulo">
          <b-form-input v-model="data.title"></b-form-input>
        </b-form-group>

        <template v-for="(row, idx) in rows">
          <div :key="idx">
            <hr />
            <b-row>
              <b-col cols="auto">
                <b-button
                  variant="danger"
                  :disabled="data.rows.length < 2"
                  @click="handleRemoveRow(idx)"
                  >-</b-button
                >
              </b-col>
              <b-col>
                <b-row>
                  <b-col>
                    <b-form-group label="Precio unitario">
                      <b-input-group>
                        <template #prepend>
                          <b-input-group-text>B/.</b-input-group-text>
                        </template>
                        <b-form-input
                          v-model="data.rows[idx].price"
                          step=".01"
                          type="number"
                        ></b-form-input>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Cantidad">
                      <b-form-input
                        v-model="data.rows[idx].qty"
                        step=".5"
                        type="number"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="3">
                    <b-form-group>
                      <template #label>
                        <strong>Total</strong>
                      </template>
                      <h4 class="m-0 p-1 text-nowrap">B/.{{ row.total }}</h4>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-form-group label="Detalle">
                  <b-form-textarea v-model="data.rows[idx].details"></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </template>
        <hr />
        <b-row>
          <b-col class="d-flex align-items-start">
            <b-button variant="light" class="border" @click="handleAddRow">+</b-button>
            <b-button variant="light" size="lg" class="ml-auto mr-1" @click="handleReset">
              Reiniciar
            </b-button>
            <b-button variant="primary" type="submit" size="lg" class="px-5" :disabled="!isValid">
              Previsualizar
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { checkNumber } from '@/utils/Utils'
import { parseISO, isAfter, isSameDay } from 'date-fns'
import { dateToDayValue } from '@/utils/Dates'
const typesOptions = [
  { text: 'Cotización', value: 'estimation' },
  { text: 'Factura', value: 'bill' }
]
const getDefaultRow = () => ({
  price: 25,
  qty: 1,
  details: ''
})
const getDefault = () => {
  return {
    client: '',
    title: '',
    date: dateToDayValue(new Date()),
    rows: [getDefaultRow()]
  }
}
export default {
  name: 'EstimatesView',
  created() {
    const data = JSON.parse(localStorage.getItem('estimation'))
    if (data && data.client && Array.isArray(data.rows)) {
      this.data = data
      if (typeof data.billNumber === 'string') {
        this.type = 'bill'
      }
    }
  },
  data() {
    return {
      typesOptions,
      type: typesOptions[0].value,
      data: getDefault()
    }
  },
  watch: {
    type: {
      handler: function (val) {
        if (val !== 'bill') {
          this.data.billNumber = null
        }
      }
    }
  },
  computed: {
    isTitleValid() {
      return typeof this.data.title === 'string' && this.data.title.length > 0
    },
    isDateValid() {
      const d0 = new Date()
      const d = parseISO(this.data.date)
      return isAfter(d, d0) || isSameDay(d, d0)
    },
    rows() {
      return Array.isArray(this.data.rows)
        ? this.data.rows.map((row) => {
            const r = checkNumber(row.price)
            const c = checkNumber(row.qty)
            return {
              ...row,
              total: r * c
            }
          })
        : []
    },
    totalAmount() {
      return this.rows.reduce((total, row) => {
        return total + checkNumber(row.total)
      }, 0)
    },
    isValid() {
      return this.isTitleValid && this.isDateValid && this.totalAmount
    }
  },
  methods: {
    handleAddRow() {
      this.data.rows.push(getDefaultRow())
    },
    handleRemoveRow(idx) {
      this.data.rows.splice(idx, 1)
    },
    handleReset() {
      localStorage.removeItem('estimation')
      this.data = getDefault()
    },
    handleSubmit(ev) {
      ev.preventDefault()
      localStorage.setItem(
        'estimation',
        JSON.stringify({
          ...this.data,
          rows: this.rows,
          totalAmount: this.totalAmount
        })
      )
      this.$router.push({ name: 'EstimationPrint' })
    }
  }
}
</script>

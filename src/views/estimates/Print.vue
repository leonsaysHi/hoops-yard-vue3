<template>
  <b-container fluid>
    <b-row class="p-3 bg-dark text-white align-items-center">
      <b-col class="d-flex align-items-center">
        <b-img src="../../assets/logo-alt.png" alt="Hoops Yard" width="80" fluid></b-img>
        <div class="ml-2 lh-1 text-uppercase"><strong>Hoops Yard</strong><br />Corporation</div>
      </b-col>
      <b-col>
        <h4 class="text-right text-uppercase">
          <strong>
            <template v-if="isBill">
              Factura
              <br />#{{ data.billNumber }}
            </template>
            <template v-else>Cotización</template>
          </strong>
        </h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="pt-3 text-center">
        <strong>RUC: 155712562-2-2021 DV77</strong>
        <br /><strong>Parque Logistico Metropolitano, Juan Diaz</strong>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col> teamhoopsyard@gmail.com </b-col>
      <b-col class="text-center"> <strong class="icon-whatsapp" />:&nbsp;6308-4298 </b-col>
      <b-col class="text-right"> <b-icon icon="instagram" />:&nbsp;@hoopsyard </b-col>
    </b-row>
    <hr class="border-dark" />
    <b-row class="text-center">
      <b-col>
        Fecha:
        <br /><strong>{{ date }}</strong>
      </b-col>
      <b-col>
        Cliente:
        <br /><strong class="text-uppercase">{{ client }}</strong>
      </b-col>
    </b-row>
    <hr class="border-dark" />
    <b-row>
      <b-col class="text-center font-weight-bold text-uppercase">
        {{ title }}
      </b-col>
    </b-row>
    <hr class="border-dark" />
    <b-row class="font-weight-bold">
      <b-col cols="9"> Detalle </b-col>
      <b-col class="text-center"> Total </b-col>
    </b-row>
    <template v-for="(row, idx) in rows">
      <div :key="idx">
        <hr class="my-2" />
        <b-row>
          <b-col cols="9">
            {{ row.details }}
          </b-col>
          <b-col class="text-center"> B/.{{ row.total }} </b-col>
        </b-row>
      </div>
    </template>
    <hr class="mt-2" />
    <b-row class="font-weight-bold">
      <b-col cols="9"> Total </b-col>
      <b-col class="text-center"> B/.{{ data.totalAmount }} </b-col>
    </b-row>
    <template v-if="isBill">
      <div class="lh-1"></div>
    </template>
    <template v-else>
      <div class="lh-1">
        <hr class="border-dark" />
        <p>
          <strong>IMPORTANTE:</strong> Esta cotización no garantiza que los espacios cotizados están
          reservados.<br />
        </p>
        <p>
          <strong
            >Para hacer su reserva efectiva y guardar el espacio en el sistema es FUNDAMENTAL abonar
            el 50% del total de su cotización.</strong
          >
        </p>
      </div>
    </template>
    <div class="d-flex justify-between mt-5 pt-3 border-top border-dark d-print-none">
      <b-button variant="light" @click="handleBack"> Volver a editar </b-button>
      <b-button class="ml-1" variant="primary" @click="handlePrint">Para generar PDF</b-button>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'EstimatesPrint',
  created() {
    const data = JSON.parse(localStorage.getItem('estimation'))
    if (data && data.client) {
      this.data = data
    }
  },
  data() {
    return {
      data: null
    }
  },
  computed: {
    isBill() {
      return typeof this.data.billNumber === 'string'
    },
    date() {
      return this.data ? this.data.date : null
    },
    client() {
      return this.data ? this.data.client : null
    },
    title() {
      return this.data ? this.data.title : null
    },
    rows() {
      return Array.isArray(this.data.rows) ? this.data.rows : []
    }
  },
  methods: {
    handleBack(ev) {
      ev.preventDefault()
      this.$router.go(-1)
    },
    handlePrint(ev) {
      ev.preventDefault()
      window.print()
    }
  }
}
</script>

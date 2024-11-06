import type { Product, Booking, Payment, RecordSummary } from '@/types'
import {
  compareAsc,
  isDate,
  startOfDay,
  endOfDay,
  isSameDay,
  addSeconds,
  eachDayOfInterval,
  isWithinInterval,
  differenceInMinutes,
  areIntervalsOverlapping,
  startOfWeek,
  addWeeks,
  addDays,
  differenceInDays
} from 'date-fns'
import type { Interval } from 'date-fns'

interface BookingAmounts extends Booking {
  amount: number
}

export class Record {
  id?: string
  title?: string
  comment?: string
  dateCreated: Date
  dateStart: Date
  dateEnd: Date
  productId?: string
  categorieId?: string
  qty?: number
  amount?: number
  productName: string | undefined
  paidWith: string | undefined
  payments: Payment[]
  bookings: Booking[]

  constructor({
    id,
    dateCreated,
    dateStart,
    dateEnd,
    productId,
    categorieId,
    product,
    amount,
    qty,
    paidWith,
    title,
    comment,
    payments,
    bookings
  }: {
    id?: string
    dateCreated?: Date
    dateStart?: Date
    dateEnd?: Date
    productId?: string
    categorieId?: string
    product?: Product
    amount?: number
    qty?: number
    paidWith?: string
    title?: string
    comment?: string
    payments?: Payment[]
    bookings?: Booking[]
  }) {
    this.id = id || undefined
    this.dateCreated = dateCreated && isDate(dateCreated) ? dateCreated : new Date()
    this.dateStart = dateStart && isDate(dateStart) ? dateStart : startOfDay(new Date())
    this.dateEnd = dateEnd && isDate(dateEnd) ? dateEnd : startOfDay(new Date())
    this.productId = productId || undefined
    this.categorieId = categorieId || undefined
    this.amount = amount ? Number(amount) : 0
    this.qty = qty ? Number(qty) : undefined
    this.title = title || undefined
    this.comment = comment || undefined
    this.payments = Array.isArray(payments) ? payments : []
    this.bookings = Array.isArray(bookings) ? bookings : []
    if (product) this.product = product
  }

  get isValid(): boolean {
    return Boolean(this.productId || this.categorieId)
  }

  get isShop(): boolean {
    return this.categorieId === 'shop'
  }

  get isBooking(): boolean {
    return this.categorieId === 'bookings'
  }

  get hasBooking() {
    return Array.isArray(this.bookings)
  }

  set product(product: Product | undefined) {
    if (product?.productId) {
      const { productId, categorieId, productName } = product
      this.productId = productId
      this.categorieId = categorieId
      this.productName = productName
    } else {
      this.productId = undefined
      this.categorieId = undefined
      this.productName = undefined
    }
  }

  get product(): Product | undefined {
    const { productId, categorieId, productName } = this
    return productId
      ? ({
          productId,
          categorieId,
          productName
        } as Product)
      : undefined
  }

  get amountPaid(): number {
    return Array.isArray(this.payments) ? this.payments.reduce((acc, p) => acc + p.amount, 0) : 0
  }

  get isPaid(): boolean {
    return Boolean(this.amount && this.amount > 0 && this.amount <= this.amountPaid)
  }

  get amountDaily() {
    const amountTotal = this.amount || 0 // this.amountPaid
    const { dateStart, dateEnd } = this
    const daysCount = isSameDay(dateStart, dateEnd)
      ? 1
      : eachDayOfInterval({ start: dateStart, end: dateEnd }).length
    const amountDaily = amountTotal ? amountTotal / daysCount : 0
    return amountDaily
  }

  get bookingsAmounts(): BookingAmounts[] | undefined {
    if (!this.hasBooking) {
      return undefined
    }
    const amountTotal = this.amount || null // this.amountPaid
    const minutesTotal = Array.isArray(this.bookings)
      ? this.bookings.reduce((acc, b: Booking) => {
          return acc + differenceInMinutes(addSeconds(b.dateEnd, 1), b.dateStart)
        }, 0)
      : 0
    return this.bookings.map((b: Booking) => {
      const minutes = differenceInMinutes(addSeconds(b.dateEnd, 1), b.dateStart)
      const amount =
        minutes && amountTotal && minutesTotal ? (minutes * amountTotal) / minutesTotal : 0
      return {
        ...b,
        amount
      } as BookingAmounts
    })
  }

  get ownInterval(): Interval {
    const { dateStart, dateEnd } = this
    return { start: startOfDay(dateStart), end: endOfDay(dateEnd) }
  }

  isWithinDay(date: Date) {
    return isWithinInterval(date, this.ownInterval)
  }

  isWithinInterval(interval: Interval) {
    return areIntervalsOverlapping(interval, this.ownInterval)
  }

  getBookingsForInterval(interval: Interval): BookingAmounts[] {
    return this.hasBooking && Array.isArray(this.bookingsAmounts)
      ? this.bookingsAmounts.filter((b) => isWithinInterval(b.dateStart, interval))
      : []
  }

  getBookingsForDate(date: Date): BookingAmounts[] {
    return this.hasBooking && Array.isArray(this.bookingsAmounts)
      ? this.bookingsAmounts.filter((b) => isSameDay(b.dateStart, date))
      : []
  }

  getAmountCashForDate(date: Date) {
    if (this.isShop && this.paidWith && this.paidWith === 'cash') {
      return this.amountDaily
    } else {
      return 0
    }
  }

  getAmountForInterval(interval: Interval): number {
    if (!this.hasBooking) {
      const daysCount = Math.min(
        eachDayOfInterval(interval).length,
        eachDayOfInterval(this.ownInterval).length
      )
      return this.amountDaily * daysCount
    } else {
      return this.getBookingsForInterval(interval).reduce((amount, b) => amount + b.amount, 0)
    }
  }

  getAmountForDate(date: Date): number {
    return !this.hasBooking
      ? this.isWithinDay(date)
        ? this.amountDaily
        : 0
      : this.getBookingsForDate(date).reduce((amount, b) => amount + b.amount, 0)
  }

  getDuplicatePayload(): Record | undefined {
    const payload = this.getSavePayload()
    if (!payload) {
      return undefined
    }
    payload.payments = []
    delete payload.id
    payload.dateCreated = new Date()
    payload.title += ' (copy)'
    // new bookings
    payload.bookings.sort((a, b) => compareAsc(a.dateStart, b.dateStart))
    const firstBooking = payload.bookings[0].dateStart
    const lastBooking = payload.bookings[payload.bookings.length - 1].dateStart
    const startSource = startOfWeek(firstBooking, { weekStartsOn: 1 })
    const startDest = startOfWeek(addWeeks(lastBooking, 1), { weekStartsOn: 1 })
    const daysDiff = differenceInDays(startDest, startSource)
    payload.bookings = payload.bookings.map((b: Booking) => {
      const booking = {
        ...b,
        dateCreated: new Date(),
        dateStart: addDays(b.dateStart, daysDiff),
        dateEnd: addDays(b.dateEnd, daysDiff)
      }
      delete booking.id
      return booking
    })
    return payload
  }

  getSavePayload(): Record | undefined {
    if (!this.categorieId) {
      return undefined
    }
    const {
      id,
      title,
      comment,
      dateCreated,
      productId,
      categorieId,
      qty: _qty,
      amount: _amount,
      payments: _payments,
      bookings: _bookings
    } = this
    let { dateStart, dateEnd } = this
    // dateStart / dateEnd:
    if (Array.isArray(_bookings) && _bookings.length) {
      const bookingsDates: Date[] = Array.isArray(_bookings)
        ? _bookings.reduce((acc, b: Booking) => {
            acc.push(b.dateStart as never, b.dateEnd as never)
            return acc.filter(Boolean)
          }, [])
        : []
      bookingsDates.sort(compareAsc)
      dateStart = bookingsDates[0]
      const dEnd = bookingsDates[bookingsDates.length - 1]
      dateEnd = isSameDay(dateStart, dEnd) ? dateStart : dEnd
    }
    // amount
    const amount = Number(_amount)
    // booked minutes
    const minutes =
      this.hasBooking && Array.isArray(_bookings) && _bookings.length > 0
        ? _bookings.reduce((min, b) => {
            return min + differenceInMinutes(addSeconds(b.dateEnd, 1), b.dateStart)
          }, 0)
        : undefined

    const recordSummary: RecordSummary = {
      title,
      amount,
      productId,
      categorieId,
      dateStart,
      dateEnd,
      minutes
    }
    // payments
    const payments: Payment[] =
      Array.isArray(_payments) && _payments.length > 0
        ? _payments.map((payment: Payment) => ({
            ...payment,
            amount: Number(payment.amount),
            record: { ...recordSummary } // record's infos for display
          }))
        : [
            {
              amount: 0,
              dateCreated: new Date(),
              record: { ...recordSummary }
            } as Payment
          ]
    // amountPaid
    const amountPaid: number = payments.reduce((acc, p) => acc + p.amount, 0)
    // bookings
    const bookings: Booking[] | undefined =
      this.hasBooking && Array.isArray(_bookings) && _bookings.length > 0
        ? _bookings.map((booking: Booking) => ({
            ...booking,
            record: {
              // record's infos for display
              ...recordSummary,
              amountPaid
            }
          }))
        : undefined
    //
    const isPaid = amountPaid >= amount
    const qty =
      (!Array.isArray(bookings) || !bookings.length) && typeof _qty === 'number'
        ? Number(_qty)
        : null
    const payload = {
      id,
      title,
      comment,
      dateCreated,
      dateStart,
      dateEnd,
      productId,
      categorieId,
      payments,
      bookings,
      qty,
      amount,
      isPaid
    } as Record
    return payload
  }
}

import { dateToTimeStamp } from '@/utils/dates'
import { format } from 'date-fns-tz'
import { checkNumber, cleanPayload } from '@/utils/utils'
import type { Timestamp } from 'firebase/firestore'
import type { Booking, Payment } from '@/types'

const categorieMapping: { [key: string]: any } = {
  24: { productId: undefined, categorieId: 'bookings' },
  20: { productId: '20', categorieId: 'others' },
  74: { productId: undefined, categorieId: 'bookings' },
  21: { productId: '21', categorieId: 'sponsors' },
  15: { productId: '15', categorieId: 'academies' },
  16: { productId: '16', categorieId: 'academies' }
}
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const dateFromFirestore = (ts: Timestamp): Date => {
  if (timezone === 'America/Panama') {
    return ts.toDate()
  }
  const date = ts.toDate()
  const result = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  return result
}

const dateToFireStore = (date: Date): Timestamp => {
  if (timezone === 'America/Panama') {
    return dateToTimeStamp(date)
  }
  const result = new Date(date ? new Date(format(date, "yyyy-MM-dd'T'HH:mm:ss-05:00")) : new Date())
  return dateToTimeStamp(result)
}

export const bookingConverter = {
  toFirestore: (row: any) => {
    const { dateEnd, dateStart, dateCreated, record } = row
    const payload = {
      ...row,
      record: cleanPayload(record),
      dateCreated: dateToFireStore(dateCreated),
      dateEnd: dateToFireStore(dateEnd),
      dateStart: dateToFireStore(dateStart)
    }
    return cleanPayload(payload)
  },
  fromFirestore: (row: any): Booking => {
    const { dateStart, dateEnd, dateCreated } = row
    // turn productId to string
    row.record.productId = row.record.productId?.toString()
    // turn categories productId into categorieId
    if (row.record.productId && Object.keys(categorieMapping).includes(row.record.productId)) {
      row.record = {
        ...row.record,
        ...categorieMapping[row.record.productId]
      }
    }
    //
    return {
      ...row,
      productId: row.productId?.toString(),
      dateStart: dateFromFirestore(dateStart),
      dateEnd: dateFromFirestore(dateEnd),
      dateCreated: dateFromFirestore(dateCreated),
      record: {
        ...row.record,
        dateStart: dateFromFirestore(row.record.dateStart),
        dateEnd: dateFromFirestore(row.record.dateEnd)
      }
    }
  }
}

export const paymentConverter = {
  toFirestore: (row: any) => {
    const { dateCreated, record } = row
    const payload = {
      ...row,
      record: {
        ...cleanPayload(record),
        amount: checkNumber(record.amount),
        dateStart: dateToFireStore(record.dateStart),
        dateEnd: dateToFireStore(record.dateEnd)
      },
      dateCreated: dateToFireStore(dateCreated)
    }
    return cleanPayload(payload)
  },
  fromFirestore: (row: any): Payment => {
    const { dateCreated } = row
    // turn productId to string
    row.record.productId = row.record.productId?.toString()
    // turn categories productId into categorieId
    if (row.record.productId && Object.keys(categorieMapping).includes(row.record.productId)) {
      row.record = {
        ...row.record,
        ...categorieMapping[row.record.productId]
      }
    }
    //
    return {
      ...row,
      amount: checkNumber(row.amount),
      dateCreated: dateFromFirestore(dateCreated),
      record: {
        ...row.record,
        dateStart: dateFromFirestore(row.record.dateStart),
        dateEnd: dateFromFirestore(row.record.dateEnd)
      }
    }
  }
}

export const recordConverter = {
  toFirestore: (row: any) => {
    const payload = {
      ...row
    }
    // dateToTimeStamp
    payload.dateCreated = dateToFireStore(payload.dateCreated)
    payload.dateEnd = dateToFireStore(payload.dateEnd)
    payload.dateStart = dateToFireStore(payload.dateStart)
    // dates:
    payload.bookings =
      Array.isArray(payload.bookings) && payload.bookings.length
        ? payload.bookings.map((booking: any) => bookingConverter.toFirestore(booking))
        : null
    payload.payments =
      Array.isArray(payload.payments) && payload.payments.length
        ? payload.payments.map((payment: any) => paymentConverter.toFirestore(payment))
        : []
    return cleanPayload(payload)
  },
  fromFirestore: (row: any) => {
    const bookings = Array.isArray(row.bookings)
      ? row.bookings.map((booking: any): Booking => bookingConverter.fromFirestore(booking))
      : null
    //
    const payments = Array.isArray(row.payments)
      ? row.payments.map((payment: any): Payment => paymentConverter.fromFirestore(payment))
      : null
    // const paymentsSum = row.payments.reduce((sum, p) => sum + p.amount, 0)
    const amount = checkNumber(row.amount)
    // turn productId to categorieId
    row.productId = row.productId?.toString()
    if (row.productId && Object.keys(categorieMapping).includes(row.productId)) {
      row = {
        ...row,
        ...categorieMapping[row.productId]
      }
    }
    //
    return {
      ...row,
      amount,
      payments,
      bookings,
      dateCreated: dateFromFirestore(row.dateCreated),
      dateStart: dateFromFirestore(row.dateStart),
      dateEnd: dateFromFirestore(row.dateEnd)
    }
  }
}
